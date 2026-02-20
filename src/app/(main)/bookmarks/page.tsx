'use client';

import { useState } from 'react';
import { mockBookmarks, mockBookmarkFolders } from '@/data/mock-data';
import { cn } from '@/lib/utils';
import { Plus, Folder, Search, ExternalLink, Trash2, Edit2 } from 'lucide-react';

export default function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const filtered = mockBookmarks.filter(bm => {
    const matchSearch = !searchQuery || bm.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFolder = !selectedFolder || bm.folderId === selectedFolder;
    return matchSearch && matchFolder;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">북마크</h1>
          <p className="text-sm text-gray-500 mt-1">자주 사용하는 페이지와 링크를 관리합니다</p>
        </div>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 flex items-center gap-1.5"><Plus className="w-4 h-4" />추가</button>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="북마크 검색"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Folder Filter */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedFolder(null)}
          className={cn('px-3 py-1.5 text-xs rounded-full font-medium transition-colors',
            !selectedFolder ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          )}
        >전체</button>
        {mockBookmarkFolders.map(folder => (
          <button
            key={folder.id}
            onClick={() => setSelectedFolder(folder.id)}
            className={cn('px-3 py-1.5 text-xs rounded-full font-medium transition-colors flex items-center gap-1',
              selectedFolder === folder.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <Folder className="w-3 h-3" />{folder.name}
          </button>
        ))}
      </div>

      {/* Bookmarks by Folder */}
      {mockBookmarkFolders.map(folder => {
        const folderBookmarks = filtered.filter(bm => bm.folderId === folder.id);
        if (folderBookmarks.length === 0 && selectedFolder && selectedFolder !== folder.id) return null;
        if (folderBookmarks.length === 0) return null;
        return (
          <div key={folder.id} className="mb-6">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-3">
              <Folder className="w-4 h-4" />{folder.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {folderBookmarks.map(bm => (
                <div key={bm.id} className="bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3 hover:shadow-sm transition-shadow group cursor-pointer">
                  <span className="text-xl">{bm.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{bm.title}</p>
                    <p className="text-xs text-gray-400 truncate">{bm.url}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                    {bm.type === 'external' && <button className="p-1 rounded hover:bg-gray-100"><ExternalLink className="w-3.5 h-3.5 text-gray-400" /></button>}
                    <button className="p-1 rounded hover:bg-gray-100"><Edit2 className="w-3.5 h-3.5 text-gray-400" /></button>
                    <button className="p-1 rounded hover:bg-red-50"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
