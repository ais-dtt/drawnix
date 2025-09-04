import React from 'react';
import { DrawingsDrawer, useDrawingsDrawer } from './index';
import { DrawingsMenuItem } from '../toolbar/app-toolbar/drawings-menu-item';

/**
 * Example component showing how to integrate the drawings drawer
 * into your application. This demonstrates the complete workflow.
 */
export const ExampleDrawingsIntegration: React.FC = () => {
  const { isOpen, openDrawer, closeDrawer } = useDrawingsDrawer();

  return (
    <>
      {/* Add this menu item to your toolbar/menu */}
      <DrawingsMenuItem onOpenDrawer={openDrawer} />
      
      {/* Add the drawer component to your app root */}
      <DrawingsDrawer isOpen={isOpen} onClose={closeDrawer} />
    </>
  );
};

/**
 * Alternative: If you want to add the drawer to an existing menu,
 * you can use the DrawingsMenuItem directly:
 * 
 * import { DrawingsMenuItem } from './components/toolbar/app-toolbar/drawings-menu-item';
 * import { DrawingsDrawer, useDrawingsDrawer } from './components/drawer';
 * 
 * function YourMenuComponent() {
 *   const { isOpen, openDrawer, closeDrawer } = useDrawingsDrawer();
 *   
 *   return (
 *     <Menu>
 *       <SaveToFile />
 *       <OpenFile />
 *       <DrawingsMenuItem onOpenDrawer={openDrawer} />
 *       <DrawingsDrawer isOpen={isOpen} onClose={closeDrawer} />
 *     </Menu>
 *   );
 * }
 */
