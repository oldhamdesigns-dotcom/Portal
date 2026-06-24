import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { cn } from '@utils/CN';
import { searchCustomers, type Customer } from '@/data/customers';
import routes from '@/navigation/routes.json';

const getInitials = (firstName: string, lastName: string) =>
  `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

const SEARCH_OPTIONS = [
  { value: 'name', label: 'Customer Name' },
  { value: 'email', label: 'Customer Email' },
];

const CustomerCard = ({ customer, onClick }: { customer: Customer; onClick: () => void }) => {
  const initials = getInitials(customer.firstName, customer.lastName);
  return (
    <button onClick={onClick} className="w-full flex items-center gap-4 px-6 py-4 text-left bg-white hover:bg-primary-50 border border-border rounded-lg shadow-[0px_2px_8px_rgba(0,0,0,0.08)] transition-colors">
      <div className="size-[48px] rounded-full bg-primary flex items-center justify-center shrink-0">
        <span className="text-white text-base font-semibold">{initials}</span>
      </div>
      <div className="flex flex-col flex-1 min-w-0">
        <p className="text-ds-h5 font-semibold text-text-body leading-snug">
          {customer.firstName} {customer.lastName}
        </p>
        <p className="text-ds-body-sm text-text-subtle mt-0.5">{customer.email}</p>
        <p className="text-ds-caption text-text-muted mt-0.5">
          {customer.phone} &nbsp;·&nbsp; {customer.id}
        </p>
      </div>
      <svg className="size-5 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
};

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialQuery = searchParams.get('q') ?? '';
  const initialType = searchParams.get('type') ?? 'name';
  const matchedOption = SEARCH_OPTIONS.find((o) => o.value === initialType) ?? SEARCH_OPTIONS[0];

  const [searchType, setSearchType] = useState(matchedOption);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [showDropdown, setShowDropdown] = useState(false);
  const [results, setResults] = useState<Customer[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const runSearch = useCallback(async (query: string, type: string) => {
    if (!query.trim()) { setResults([]); return; }
    setIsSearching(true);
    const field = type === 'email' ? 'email' : 'name';
    const data = await searchCustomers(query, field);
    setResults(data);
    setIsSearching(false);
  }, []);

  useEffect(() => {
    runSearch(initialQuery, initialType);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    navigate(`${routes.SEARCH_RESULTS}?q=${encodeURIComponent(query)}&type=${searchType.value}`, { replace: true });
    await runSearch(query, searchType.value);
  }, [searchType, navigate, runSearch]);

  const handleTypeChange = useCallback(async (opt: typeof SEARCH_OPTIONS[0]) => {
    setSearchType(opt);
    setShowDropdown(false);
    navigate(`${routes.SEARCH_RESULTS}?q=${encodeURIComponent(searchQuery)}&type=${opt.value}`, { replace: true });
    await runSearch(searchQuery, opt.value);
  }, [searchQuery, navigate, runSearch]);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setResults([]);
    navigate(`${routes.SEARCH_RESULTS}?q=&type=${searchType.value}`, { replace: true });
  }, [searchType, navigate]);

  const hasSearched = searchQuery.trim().length > 0;

  return (
    <div className="flex flex-col px-8 py-6 min-h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 mb-6 text-sm">
        <Link to={routes.MAIN_DASHBOARD} className="text-text-muted underline hover:text-text-subtle transition-colors">
          Support Portal
        </Link>
        <svg className="size-3 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-text-body font-semibold">Search Results</span>
      </div>

      {/* Search bar */}
      <div className="flex w-full max-w-2xl mb-8 rounded-lg shadow-[0px_2px_8px_rgba(0,0,0,0.08)]">
        {/* Type dropdown */}
        <div className="relative shrink-0" ref={dropdownRef}>
          <button
            className={cn(
              'flex items-center justify-between gap-2 h-[52px] px-4 border border-r-0 rounded-l-lg min-w-[180px] transition-colors',
              (inputFocused || showDropdown) ? 'border-[#bbbbbb]' : 'border-border hover:border-[#bbbbbb]',
              showDropdown ? 'bg-ds-neutral-50' : 'bg-white hover:bg-ds-neutral-50',
            )}
            onClick={() => setShowDropdown((v) => !v)}
          >
            <span className="text-text-subtle text-sm">{searchType.label}</span>
            <svg className={cn("size-4 text-text-muted shrink-0 transition-transform duration-200", showDropdown ? 'rotate-180' : 'rotate-0')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showDropdown && (
            <div className="absolute left-0 top-full mt-1 w-full bg-white border border-border rounded-lg shadow-md z-50 overflow-hidden">
              {SEARCH_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  className="w-full px-4 py-2.5 text-left text-sm text-text-subtle hover:bg-primary-50 transition-colors"
                  onClick={() => handleTypeChange(opt)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Input */}
        <div className={cn(
          'flex items-center flex-1 h-[52px] border rounded-r-lg px-4 gap-2 transition-colors',
          (inputFocused || showDropdown) ? 'border-[#bbbbbb] bg-ds-neutral-50' : 'border-border bg-white hover:border-[#bbbbbb] hover:bg-ds-neutral-50',
        )}>
          <input
            className="flex-1 outline-none bg-transparent text-sm text-text-body placeholder:text-text-muted"
            placeholder={`Search by ${searchType.label.toLowerCase()}`}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            autoFocus
          />
          {isSearching ? (
            <div className="size-4 border-2 border-primary border-t-transparent rounded-full animate-spin shrink-0" />
          ) : searchQuery ? (
            <button onClick={handleClear} className="text-text-muted hover:text-text-body transition-colors shrink-0">
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <svg className="size-4 text-text-muted shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          )}
        </div>
      </div>

      {/* Results heading */}
      <div className="flex items-center gap-2 mb-1">
        <svg className="size-5 text-text-body" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <h2 className="text-ds-h4 font-bold text-text-body">Search Results</h2>
      </div>

      {hasSearched && (
        <p className="text-sm text-text-subtle mb-4">
          {isSearching
            ? 'Searching…'
            : `Found ${results.length} result${results.length !== 1 ? 's' : ''} for ${searchType.label} "${searchQuery}"`}
        </p>
      )}

      <div className="border-t border-gray-2 mb-4" />

      {/* Results list */}
      {!hasSearched ? (
        <p className="text-sm text-text-muted">Enter a search query above to find customers.</p>
      ) : isSearching ? null : results.length === 0 ? (
        <p className="text-sm text-text-muted">No customers found for "{searchQuery}".</p>
      ) : (
        <div className="flex flex-col gap-2">
          {results.map((customer) => (
            <CustomerCard
                key={customer.id}
                customer={customer}
                onClick={() => navigate(routes.CUSTOMER_PROFILE.replace(':id', customer.id))}
              />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(SearchResultsPage);
