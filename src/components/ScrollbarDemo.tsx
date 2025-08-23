import React from 'react';
import CustomScrollbar from '@/components/ui/custom-scrollbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ScrollbarDemo = () => {
  // Sample data for demonstration
  const sampleItems = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: `This is a description for item ${i + 1}. It contains some sample text to demonstrate how the custom scrollbar works with different content lengths.`,
    category: ['Tech', 'Design', 'Business', 'Science'][i % 4],
    date: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString(),
  }));

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Custom Scrollbar Demo</h1>
        <p className="text-muted-foreground">
          Demonstration of theme-aware custom scrollbars with different variants
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Light theme:</strong> Blue scrollbar | <strong>Dark theme:</strong> Yellow scrollbar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default Variant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Default Variant
              <Badge variant="secondary">8px width</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomScrollbar height="300px" variant="default">
              <div className="space-y-2 pr-2">
                {sampleItems.slice(0, 20).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{item.category}</Badge>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CustomScrollbar>
          </CardContent>
        </Card>

        {/* Thin Variant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Thin Variant
              <Badge variant="secondary">6px width</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomScrollbar height="300px" variant="thin">
              <div className="space-y-2 pr-2">
                {sampleItems.slice(0, 15).map((item) => (
                  <div
                    key={item.id}
                    className="p-2 border rounded hover:bg-accent/50 transition-colors"
                  >
                    <h4 className="font-medium text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </CustomScrollbar>
          </CardContent>
        </Card>

        {/* Thick Variant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Thick Variant
              <Badge variant="secondary">12px width</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomScrollbar height="300px" variant="thick">
              <div className="space-y-3 pr-2">
                {sampleItems.slice(0, 12).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <h4 className="font-semibold">{item.title}</h4>
                    <p className="text-sm text-muted-foreground mt-2">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge>{item.category}</Badge>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CustomScrollbar>
          </CardContent>
        </Card>

        {/* Minimal Variant */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Minimal Variant
              <Badge variant="secondary">4px width</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomScrollbar height="300px" variant="minimal">
              <div className="space-y-1 pr-1">
                {sampleItems.slice(0, 25).map((item) => (
                  <div
                    key={item.id}
                    className="p-2 text-sm border rounded hover:bg-accent/50 transition-colors"
                  >
                    <div className="font-medium">{item.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {item.description}
                    </div>
                  </div>
                ))}
              </div>
            </CustomScrollbar>
          </CardContent>
        </Card>
      </div>

      {/* Large Content Example */}
      <Card>
        <CardHeader>
          <CardTitle>Large Content Grid (600px height)</CardTitle>
        </CardHeader>
        <CardContent>
          <CustomScrollbar height="600px" variant="default" className="border rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sampleItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{item.category}</Badge>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CustomScrollbar>
        </CardContent>
      </Card>

      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="p-3 border rounded-lg">
            <div className="font-medium text-blue-600 dark:text-blue-400">Theme Aware</div>
            <div className="text-muted-foreground">Adapts to light/dark theme</div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="font-medium text-green-600 dark:text-green-400">Auto Hide</div>
            <div className="text-muted-foreground">Scrollbar fades when not in use</div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="font-medium text-purple-600 dark:text-purple-400">Smooth</div>
            <div className="text-muted-foreground">Smooth scrolling experience</div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="font-medium text-orange-600 dark:text-orange-400">Responsive</div>
            <div className="text-muted-foreground">Works on all screen sizes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollbarDemo;
