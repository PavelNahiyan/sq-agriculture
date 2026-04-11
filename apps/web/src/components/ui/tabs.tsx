import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';

const TabsRoot = Tabs;

const TabsListComponent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof TabsList>
>(({ className, ...props }, ref) => (
  <TabsList
    ref={ref}
    className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
    {...props}
  />
));
TabsListComponent.displayName = 'TabsList';

const TabsTriggerComponent = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof TabsTrigger>
>(({ className, ...props }, ref) => (
  <TabsTrigger
    ref={ref}
    className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
    {...props}
  />
));
TabsTriggerComponent.displayName = 'TabsTrigger';

const TabsContentComponent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof TabsContent>
>(({ className, ...props }, ref) => (
  <TabsContent
    ref={ref}
    className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    {...props}
  />
));
TabsContentComponent.displayName = 'TabsContent';

export { TabsRoot as Tabs, TabsListComponent as TabsList, TabsTriggerComponent as TabsTrigger, TabsContentComponent as TabsContent };
