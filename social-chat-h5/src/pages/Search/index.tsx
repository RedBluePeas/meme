/**
 * MagnifyingGlassIcon - 全局搜索页面
 * 性能优化: 使用防抖 + LazyImage
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Tabs, Tab, Avatar, Card, CardBody } from '@heroui/react';
import { MagnifyingGlassIcon as MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { MainLayout } from '@/components/Layout';
import { LazyImage } from '@/components/LazyImage';
import { useSearch } from '@/hooks/useSearch';
import { useDebounce } from '@/hooks/usePerformance';
import { SearchType } from '@/types/models';

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { result, loading, history, search, loadHistory, deleteHistory } = useSearch();
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState<SearchType>('all');

  useEffect(() => {
    loadHistory();
  }, []);

  // 防抖搜索 - 300ms 后执行
  const debouncedSearch = useDebounce(async (searchKeyword: string, searchType: SearchType) => {
    if (!searchKeyword.trim()) return;
    await search({ keyword: searchKeyword.trim(), type: searchType });
  }, 300, []);

  const handleKeywordChange = useCallback((value: string) => {
    setKeyword(value);
    if (value.trim()) {
      debouncedSearch(value, type);
    }
  }, [type, debouncedSearch]);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    await search({ keyword: keyword.trim(), type });
  };

  const handleHistoryClick = (historyKeyword: string) => {
    setKeyword(historyKeyword);
    search({ keyword: historyKeyword, type });
  };

  return (
    <MainLayout showTabBar={false} showNavBar={false}>
      <div className="min-h-screen bg-gray-50">
        {/* 搜索栏 */}
        <div className="bg-white p-4 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Input
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索用户、内容、群组"
              startContent={<MagnifyingGlassIcon className="w-[18px] h-[18px] text-gray-400" />}
              classNames={{ input: 'text-sm' }}
            />
            <button onClick={() => navigate(-1)} className="text-sm text-gray-600">
              取消
            </button>
          </div>
        </div>

        {/* 搜索历史 */}
        {!keyword && history.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm text-gray-600 mb-3">搜索历史</h3>
            <div className="flex flex-wrap gap-2">
              {history.map((item) => (
                <div key={item.id} className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full">
                  <span className="text-sm" onClick={() => handleHistoryClick(item.keyword)}>
                    {item.keyword}
                  </span>
                  <button onClick={() => deleteHistory(item.id)}>
                    <XMarkIcon className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 搜索结果 */}
        {keyword && (
          <div className="p-4">
            <Tabs selectedKey={type} onSelectionChange={(key) => setType(key as SearchType)}>
              <Tab key="all" title="全部" />
              <Tab key="user" title="用户" />
              <Tab key="post" title="内容" />
              <Tab key="group" title="群组" />
            </Tabs>

            <div className="mt-4 space-y-3">
              {/* 用户结果 */}
              {(type === 'all' || type === 'user') &&
                result.users.map((user) => (
                  <Card key={user.id} onClick={() => navigate(`/users/${user.id}`)}>
                    <CardBody>
                      <div className="flex items-center gap-3">
                        <Avatar
                          as="span"
                          ImgComponent={LazyImage}
                          src={user.avatar}
                          name={user.nickname}
                          size="lg"
                        />
                        <div>
                          <h3 className="font-medium">{user.nickname}</h3>
                          <p className="text-sm text-gray-500">{user.username}</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}

              {/* 内容结果 */}
              {(type === 'all' || type === 'post') &&
                result.posts.map((post) => (
                  <Card key={post.id} onClick={() => navigate(`/posts/${post.id}`)}>
                    <CardBody>
                      <p className="line-clamp-2">{post.content}</p>
                    </CardBody>
                  </Card>
                ))}

              {/* 群组结果 */}
              {(type === 'all' || type === 'group') &&
                result.groups.map((group) => (
                  <Card key={group.id} onClick={() => navigate(`/groups/${group.id}`)}>
                    <CardBody>
                      <div className="flex items-center gap-3">
                        <Avatar
                          as="span"
                          ImgComponent={LazyImage}
                          src={group.avatar}
                          name={group.name}
                          size="lg"
                        />
                        <div>
                          <h3 className="font-medium">{group.name}</h3>
                          <p className="text-sm text-gray-500">{group.memberCount} 人</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchPage;
