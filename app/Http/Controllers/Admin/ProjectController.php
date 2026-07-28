<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function store(Request $request)
    {
        $this->normalizeTags($request);

        $validated = $request->validate([
            'title'       => 'required|string|max:200',
            'category'    => 'required|in:web,app,iot,other',
            'description' => 'required|string|max:1000',
            'demo_url'    => 'nullable|url',
            'repo_url'    => 'nullable|url',
            'year'        => 'nullable|integer|min:2000|max:2099',
            'is_featured' => 'nullable|boolean',
            'is_visible'  => 'nullable|boolean',
            'sort_order'  => 'nullable|integer',
            'tags'        => 'nullable|array',
            'tags.*'      => 'string|max:50',
        ]);

        $projectData = $request->only([
            'title', 'category', 'description', 'demo_url', 'repo_url', 'year', 'sort_order'
        ]);

        $projectData['is_featured'] = $request->boolean('is_featured', false);
        $projectData['is_visible'] = $request->boolean('is_visible', true);

        $project = Project::create($projectData);

        if ($request->has('tags')) {
            foreach ($validated['tags'] ?? [] as $tagText) {
                if (!empty($tagText)) {
                    $project->tags()->create(['tag' => $tagText]);
                }
            }
        }

        return back()->with('success', 'Project berhasil ditambahkan.');
    }

    public function update(Request $request, Project $project)
    {
        $this->normalizeTags($request);

        $validated = $request->validate([
            'title'       => 'required|string|max:200',
            'category'    => 'required|in:web,app,iot,other',
            'description' => 'required|string|max:1000',
            'demo_url'    => 'nullable|url',
            'repo_url'    => 'nullable|url',
            'year'        => 'nullable|integer|min:2000|max:2099',
            'is_featured' => 'nullable|boolean',
            'is_visible'  => 'nullable|boolean',
            'sort_order'  => 'nullable|integer',
            'tags'        => 'nullable|array',
            'tags.*'      => 'string|max:50',
        ]);

        $projectData = $request->only([
            'title', 'category', 'description', 'demo_url', 'repo_url', 'year', 'sort_order'
        ]);

        $projectData['is_featured'] = $request->boolean('is_featured', false);
        $projectData['is_visible'] = $request->boolean('is_visible', false);

        $project->update($projectData);

        if ($request->has('tags')) {
            $project->tags()->delete();
            foreach ($validated['tags'] ?? [] as $tagText) {
                if (!empty($tagText)) {
                    $project->tags()->create(['tag' => $tagText]);
                }
            }
        }

        return back()->with('success', 'Project berhasil diperbarui.');
    }

    private function normalizeTags(Request $request): void
    {
        if (!$request->has('tags')) {
            return;
        }

        $values = $request->input('tags');
        $values = is_array($values) ? $values : [$values];
        $tags = [];

        foreach ($values as $value) {
            foreach (preg_split('/[,\r\n]+/', (string) $value) as $tag) {
                $tag = trim($tag);

                if ($tag !== '') {
                    $tags[] = $tag;
                }
            }
        }

        $request->merge(['tags' => array_values(array_unique($tags))]);
    }

    public function destroy(Project $project)
    {
        if ($project->thumbnail) {
            Storage::disk('public')->delete($project->thumbnail);
        }
        $project->delete();
        return back()->with('success', 'Project berhasil dihapus.');
    }

    public function uploadThumbnail(Request $request, Project $project)
    {
        $request->validate([
            'thumbnail' => 'required|image|max:2048'
        ]);

        if ($project->thumbnail) {
            Storage::disk('public')->delete($project->thumbnail);
        }

        $path = $request->file('thumbnail')->store('projects', 'public');
        $project->update(['thumbnail' => $path]);

        return back()->with('success', 'Thumbnail project berhasil diperbarui.');
    }
}
