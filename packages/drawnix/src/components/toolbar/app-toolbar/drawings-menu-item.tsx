import React from 'react';
import { DrawingsIcon } from '../../icons';
import MenuItem from '../../menu/menu-item';
import { useI18n } from '../../../i18n';

interface DrawingsMenuItemProps {
  onOpenDrawer: () => void;
}

export const DrawingsMenuItem: React.FC<DrawingsMenuItemProps> = ({ onOpenDrawer }) => {
  const { t } = useI18n();
  
  return (
    <MenuItem
      data-testid="drawings-button"
      onSelect={() => {
        onOpenDrawer();
      }}
      icon={DrawingsIcon}
      aria-label="My Drawings"
    >
      My Drawings
    </MenuItem>
  );
};

DrawingsMenuItem.displayName = 'DrawingsMenuItem';
