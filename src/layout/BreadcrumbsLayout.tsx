import {
  createContext,
  Fragment,
  memo,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link } from 'react-router';
import { cn } from '@utils/CN';
import VoidFn from '@utils/fn-utils';

const BreadcrumbsContext = createContext<{
  breadcrumbs: Breadcrumbs[];
  setBreadcrumbs: (breadcrumbs: Breadcrumbs[]) => void;
}>({
  breadcrumbs: [],
  setBreadcrumbs: (breadcrumbs: Breadcrumbs[]) => VoidFn(breadcrumbs),
});

export const useBreadcrumbs = () => useContext(BreadcrumbsContext);

const BreadcrumbsLayout = ({
  breadcrumbs: breadcrumbsProp = [],
  children,
}: {
  breadcrumbs: Breadcrumbs[];
  children: ReactNode;
}) => {
  const [additionalBreadcrumbs, setAdditionalBreadcrumbs] = useState<Breadcrumbs[]>([]);
  const breadcrumbs = useMemo(
    () => [...breadcrumbsProp, ...additionalBreadcrumbs],
    [breadcrumbsProp, additionalBreadcrumbs]
  );

  useEffect(() => {
    setAdditionalBreadcrumbs([]);
  }, [breadcrumbsProp]);

  return (
    <BreadcrumbsContext.Provider
      value={{ breadcrumbs: additionalBreadcrumbs, setBreadcrumbs: setAdditionalBreadcrumbs }}
    >
      {Array.isArray(breadcrumbs) && breadcrumbs.length ? (
        <div className={'mx-2 flex gap-2 rounded-xl bg-gray p-2'}>
          {breadcrumbs.map(({ title, path }, idx) => {
            const isLast = breadcrumbs.length === idx + 1;
            return (
              <Fragment key={`breadcrumb-${idx}`}>
                <Link
                  to={path}
                  className={cn('text-primary hover:underline', {
                    'pointer-events-none text-black hover:no-underline': isLast,
                  })}
                >
                  {title}
                </Link>
                {!isLast ? <span>{'/'}</span> : null}
              </Fragment>
            );
          })}
        </div>
      ) : null}
      {children}
    </BreadcrumbsContext.Provider>
  );
};

export default memo(BreadcrumbsLayout);
