import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useUserData } from '@/context/UserContext';
import useUserFormat from '@hooks/useUserFormat';
import { searchCustomers, type Customer } from '@/data/customers';
import routes from '@/navigation/routes.json';
import { cn } from '@utils/CN';

const Highlight = ({ text, query }: { text: string; query: string }) => {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-primary font-semibold">{text.slice(idx, idx + query.length)}</span>
      {text.slice(idx + query.length)}
    </>
  );
};


const SEARCH_OPTIONS = [
  { value: 'name', label: 'Customer Name' },
  { value: 'email', label: 'Customer Email' },
];

const INFO_CARDS = [
  {
    num: 1,
    badgeColor: 'bg-primary',
    title: 'Search Customers',
    desc: 'By name or email',
    extra: null,
  },
  {
    num: 2,
    badgeColor: 'bg-primary-600',
    title: 'View Profile',
    desc: 'Account details, stats, balance, and quick actions',
    extra: null,
  },
  {
    num: 3,
    badgeColor: 'bg-primary-800',
    title: 'Filter Within Profile',
    desc: 'Search transactions and tickets by type and status',
    extra: null,
  },
];

const MainDashboardPage = () => {
  const { userData } = useUserData();
  const navigate = useNavigate();
  const { name } = useUserFormat(userData?.loggedInUserData);
  const firstName = userData?.loggedInUserData?.firstName || name.split(' ')[0];
  const [searchType, setSearchType] = useState(SEARCH_OPTIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setHasSearched(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) { setResults([]); setHasSearched(false); return; }
    setIsSearching(true);
    setHasSearched(true);
    const field = searchType.value === 'email' ? 'email' : 'name';
    const data = await searchCustomers(query, field);
    setResults(data);
    setIsSearching(false);
  }, [searchType]);

  return (
    <div className="flex flex-col items-center justify-center px-6 min-h-full">
      {/* Greeting */}
      <div className="text-center mb-8 w-full max-w-2xl">
        <h1 className="text-[40px] font-bold text-[#101828] leading-tight mb-3">
          Welcome back, {firstName || 'there'}!
        </h1>
        <p className="text-lg text-text-subtle">
          Which customer are we helping today?
        </p>
      </div>

      {/* Search bar */}
      <div className="flex w-full max-w-2xl mb-16 rounded-lg shadow-[0px_2px_8px_rgba(0,0,0,0.08)]" ref={searchRef}>
          {/* Type dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              className={cn(
                'flex items-center justify-between gap-2 h-[60px] px-4 border border-r-0 rounded-l-lg min-w-[180px] transition-colors',
                (inputFocused || showDropdown) ? 'border-[#bbbbbb]' : 'border-border hover:border-[#bbbbbb]',
                showDropdown ? 'bg-[#fafafa]' : 'bg-white hover:bg-[#fafafa]',
              )}
              onClick={() => setShowDropdown((v) => !v)}
            >
              <span className="text-text-subtle text-base">{searchType.label}</span>
              <svg className="size-4 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showDropdown && (
              <div className="absolute left-0 top-full mt-1 w-full bg-white border border-border rounded-lg shadow-md z-50 overflow-hidden">
                {SEARCH_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className="w-full px-4 py-2.5 text-left text-sm text-text-subtle hover:bg-primary-50 transition-colors"
                    onClick={() => { setSearchType(opt); setShowDropdown(false); setResults([]); setHasSearched(false); setSearchQuery(''); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Text input + results anchored to input only */}
          <div className="relative flex-1">
            <div className={cn(
              'flex items-center h-[60px] border rounded-r-lg px-4 gap-2 transition-colors',
              (inputFocused || showDropdown) ? 'border-[#bbbbbb] bg-[#fafafa]' : 'border-border bg-white hover:border-[#bbbbbb] hover:bg-[#fafafa]',
            )}>
              <input
                className="flex-1 outline-none bg-transparent text-base text-text-body placeholder:text-text-muted"
                placeholder={`Search customer by ${searchType.value === 'email' ? 'email' : 'name'}`}
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery.trim()) {
                    navigate(`${routes.SEARCH_RESULTS}?q=${encodeURIComponent(searchQuery)}&type=${searchType.value}`);
                  }
                }}
              />
              {isSearching ? (
                <div className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
              ) : searchQuery ? (
                <button
                  onClick={() => { setSearchQuery(''); setResults([]); setHasSearched(false); }}
                  className="text-text-muted hover:text-text-body transition-colors shrink-0"
                >
                  <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <svg className="size-5 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
              )}
            </div>

            {/* Results dropdown — spans input width only */}
            {hasSearched && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden max-h-[320px] overflow-y-auto">
                {results.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-text-muted">No customers found.</p>
                ) : (
                  results.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => navigate(routes.CUSTOMER_PROFILE.replace(':id', c.id))}
                      className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-primary-50 transition-colors border-b border-[#f0f0f0] last:border-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-text-body">
                          <Highlight text={`${c.firstName} ${c.lastName}`} query={searchType.value === 'name' ? searchQuery : ''} />
                        </p>
                        <p className="text-xs text-text-muted">
                          <Highlight text={c.email} query={searchType.value === 'email' ? searchQuery : ''} />
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
      </div>

      {/* Info cards */}
      <div className="flex gap-6 w-full max-w-2xl">
        {INFO_CARDS.map((card) => (
          <div
            key={card.num}
            className="relative flex-1 bg-white border border-border rounded-lg p-5 pt-7"
          >
            <div
              className={`absolute -top-3 -left-3 size-8 rounded-full ${card.badgeColor} flex items-center justify-center shadow-md`}
            >
              <span className="text-white text-sm font-bold">{card.num}</span>
            </div>
            <p className="font-bold text-sm text-text-body mb-1">{card.title}</p>
            <p className="text-xs text-[#4a5565] leading-relaxed">{card.desc}</p>
            {card.extra && (
              <div className="border-t border-[#e2e8f0] pt-2 mt-3">{card.extra}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(MainDashboardPage);
