import { ComponentType, memo, MemoExoticComponent, useCallback, useMemo } from 'react';
import useMenu from '@hooks/useMenu';
import { cn } from '@utils/CN';
import ArrowIcon from '@icons/arrows/ArrowIcon';
import CloseIcon from '@icons/CloseIcon';
import VoidFn from '@utils/fn-utils';

type DropdownProps = {
  selectedOption: any;
  buttonClassName?: any;
  optionClassName?: any;
  optionContainerClassName?: any;
  selectedOptionClassName?: any;
  options: any[];
  getOptionLabel?: (option: any) => string;
  onChange?: (option: any) => void;
  getOptionValue?: (option: any) => string;
  compareWith?: (option: any) => boolean;
  placeholder?: string;
  hideOptions?: boolean;
  hideArrow?: boolean;
  hideClear?: boolean;
  OptionComponent?: MemoExoticComponent<ComponentType<any>>;
};

const Option = memo(
  ({
    option,
    getOptionLabel = (option) => option,
  }: {
    option: any;
    getOptionLabel: (option: any) => any;
  }) => {
    return <div>{getOptionLabel(option)}</div>;
  }
);

const Dropdown = ({
  selectedOption,
  getOptionLabel = (option) => option,
  onChange = (option) => VoidFn(option),
  getOptionValue = (option) => option,
  placeholder = '',
  options = [],
  compareWith = (option: any) => selectedOption === option,
  OptionComponent = Option,
  buttonClassName,
  optionClassName,
  optionContainerClassName,
  selectedOptionClassName,
  hideOptions = false,
  hideArrow = false,
  hideClear = false,
}: DropdownProps) => {
  const dropdownMenu = useMenu();

  const label = useMemo(
    () => getOptionLabel(selectedOption) ?? getOptionLabel(options.find(compareWith)),
    [selectedOption, getOptionLabel, compareWith, options]
  );

  const onChangeValue = useCallback(
    (e: any, option: any) => {
      onChange({ ...e, target: { ...e.target, value: getOptionValue(option) } });
      dropdownMenu.setVisible(false);
    },
    [onChange, getOptionValue, dropdownMenu]
  );

  return (
    <>
      <button
        className={cn('flex items-center justify-between gap-2 outline-0', buttonClassName)}
        ref={dropdownMenu.ref}
        {...dropdownMenu.itemProps}
      >
        {label ? label : <span className={'text-black text-opacity-50'}>{placeholder}</span>}
        {!hideOptions ? (
          <div className={'flex items-center gap-2'}>
            {!hideClear && !!label ? (
              <div
                role={'button'}
                className={'rounded-full p-1 hover:bg-gray'}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange({ ...e, target: { ...e.target, value: undefined } });
                }}
              >
                <CloseIcon />
              </div>
            ) : null}
            {!hideArrow ? <ArrowIcon rotate={dropdownMenu.visible ? 180 : 0} /> : null}
          </div>
        ) : null}
      </button>
      {dropdownMenu.visible ? (
        <div
          className={cn(
            'animate__animated animate__fadeIn animate__faster ml-auto mt-[10px] flex flex-col gap-2 overflow-y-auto rounded bg-white px-2 py-3 shadow-2xl shadow-gray-1',
            optionContainerClassName
          )}
          ref={dropdownMenu.menuRef}
          style={dropdownMenu.styles}
          {...dropdownMenu.props}
        >
          {options.map((option, idx) => (
            <button
              key={'option-' + idx}
              onClick={(e) => onChangeValue(e, option)}
              className={cn(
                'flex w-[100px] justify-center rounded-lg hover:bg-placeholder',
                optionClassName,
                { [selectedOptionClassName]: compareWith(option) }
              )}
            >
              <OptionComponent
                option={option}
                getOptionLabel={getOptionLabel}
              />
            </button>
          ))}
        </div>
      ) : null}
    </>
  );
};

export default memo(Dropdown);
