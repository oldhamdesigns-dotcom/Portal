import { ComponentType, memo, MemoExoticComponent, useCallback, useMemo } from 'react';
import useMenu from '@hooks/useMenu';
import { cn } from '@utils/CN';

type DropdownProps = {
  selectedOption: any;
  buttonClassName?: any;
  optionClassName?: any;
  optionContainerClassName?: any;
  options: any[];
  getOptionLabel?: (option: any) => string;
  onChange?: (option: any) => void;
  getOptionValue?: (option: any) => string;
  compareWith?: (option: any) => boolean;
  OptionComponent?: MemoExoticComponent<ComponentType<any>>;
}

const Option = memo(({ option, getOptionLabel = (option) => option }: {
  option: any,
  getOptionLabel: (option: any) => any
}) => {
  return <div>{getOptionLabel(option)}</div>;
});

const Dropdown = ({
                    selectedOption,
                    getOptionLabel = (option) => option,
                    onChange = (option) => console.log(option),
                    getOptionValue = (option) => option,
                    options = [],
                    // compareWith = (option: any) => selectedOption === option,
                    OptionComponent = Option,
                    buttonClassName,
                    optionClassName,
                    optionContainerClassName,
                  }: DropdownProps) => {
  const dropdownMenu = useMenu();

  const label = useMemo(() => getOptionLabel(selectedOption), [selectedOption, getOptionLabel]);

  const onChangeValue = useCallback((option: any) => {
    onChange(getOptionValue(option));
    dropdownMenu.setVisible(false);
  }, [onChange, getOptionValue]);

  return <>
    <button
      className={cn('flex items-center gap-2 outline-0', buttonClassName)}
      ref={dropdownMenu.ref}
      {...dropdownMenu.itemProps}
    >
      {label}
    </button>
    {dropdownMenu.visible ? (
      <div
        className={
          cn('animate__animated animate__fadeIn animate__faster ml-auto mt-[10px] flex w-max flex-col gap-2 overflow-y-auto rounded bg-white px-2 py-3 shadow-lg', optionContainerClassName)
        }
        ref={dropdownMenu.menuRef}
        style={dropdownMenu.styles}
        {...dropdownMenu.props}
      >
        {options.map((option, idx) => (
          <button key={'option-' + idx} onClick={() => onChangeValue(option)}
                  className={cn('flex w-[100px] justify-center rounded-lg hover:bg-placeholder', optionClassName)}>
            <OptionComponent option={option} getOptionLabel={getOptionLabel} />
          </button>
        ))}
      </div>) : null}
  </>;
};

export default memo(Dropdown);