import { Fragment, memo, useMemo } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import CopyIcon from '@icons/CopyIcon';
import { cn } from '@utils/CN';
import { toast } from 'react-toastify';

const dateFields = ['policyEffectiveDate', 'policyEnteredDate', 'DATE'];

const timeFields = ['startTime', 'endTime', 'TIME'];

const dateTimeEpoch = ['created'];

const dateTimeFields = ['cycleStartUTC', 'cycleEndUTC', 'DATE_TIME'];

const amountFields = ['amount', 'AMOUNT'];
const amountCentFields = ['payrangeFee', 'CENT_AMOUNT'];
const percentFields = ['customFeeRate', 'CUSTOM_AMOUNT'];

export const formatCurrency = (amount: any, locale = 'en-US', currency = 'USD') => {
  if (amount === null || amount === '') return '';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

dayjs.extend(utc);

export const FormatValue = memo(
  ({ prop, value, children }: { prop: string; value: string | number; children: any }) => {
    const formattedValue = useMemo(() => {
      if (dateFields.includes(prop)) {
        const date = dayjs(value).utc().local();
        return date.format('MM/DD/YYYY');
      } else if (timeFields.includes(prop)) {
        const time = dayjs(+value * 1000)
          .utc()
          .local();
        return time.format('hh:mm:ss A');
      } else if (dateTimeEpoch.includes(prop)) {
        const time = dayjs(+value * 1000)
          .utc()
          .local();
        return time.format('MM/DD/YYYY hh:mm:ss A');
      } else if (dateTimeFields.includes(prop)) {
        const time = dayjs(value).utc().local();
        return time.format('MM/DD/YYYY hh:mm:ss A');
      } else if (amountFields.includes(prop)) {
        return formatCurrency(value);
      } else if (amountCentFields.includes(prop)) {
        return formatCurrency(+value / 100);
      } else if (percentFields.includes(prop)) {
        return `${value}%`;
      }
      return null;
    }, [prop, value]);

    return <Fragment>{formattedValue ?? children}</Fragment>;
  }
);

export const CopyFormatter = ({
  children = <></>,
  textToCopy = '',
  onCopy = () => console.log('onCopy'),
  className = '',
}: {
  children: any;
  textToCopy: string;
  onCopy?: () => void;
  className?: string;
}) => (
  <CopyToClipboard
    text={textToCopy}
    onCopy={() => {
      onCopy();
      toast.success('Copied to clipboard');
    }}
  >
    <p className={cn('flex cursor-pointer flex-row items-center gap-2', className)}>
      <CopyIcon />
      {children}
    </p>
  </CopyToClipboard>
);
