import { useState } from 'react';
import { useClick, useDismiss, useFloating, useHover, useInteractions } from '@floating-ui/react';

type EventProps = {
  enableClick?: boolean;
  enableHover?: boolean;
  enableDismiss?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
};

const useMenu = (
  {
    enableClick = true,
    enableHover = false,
    enableDismiss = true,
    onOpen = () => console.log('onOpen'),
    onClose = () => console.log('onClose'),
  }: EventProps = {
    enableClick: true,
    enableHover: false,
    enableDismiss: true,
    onOpen: () => console.log('onOpen'),
    onClose: () => console.log('onClose'),
  }
) => {
  const [visible, setVisible] = useState<boolean>(false);

  const { refs, floatingStyles, context } = useFloating({
    open: visible,
    onOpenChange: (value) => {
      setVisible(value);
      if (visible) {
        onOpen();
      } else {
        onClose();
      }
    },
    placement: 'bottom-start',
    transform: false,
  });
  const click = useClick(context, { enabled: enableClick });
  const hover = useHover(context, { enabled: enableHover });
  const dismiss = useDismiss(context, { enabled: enableDismiss });

  const { getReferenceProps, getFloatingProps } = useInteractions([click, hover, dismiss]);

  return {
    ref: refs.setReference,
    menuRef: refs.setFloating,
    styles: floatingStyles,
    itemProps: getReferenceProps(),
    props: getFloatingProps(),
    visible,
    setVisible,
  };
};

export default useMenu;
