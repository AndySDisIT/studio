'use client';

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { LifeBuoy } from 'lucide-react';

export function ResourceHub() {
  return (
    <Card className="h-full bg-card/80 backdrop-blur-sm border-blue-400/50">
        <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
                <LifeBuoy className="text-blue-400" />
                Resource Hub
            </CardTitle>
            <CardDescription className="text-xs">
                Tools for your growth and well-being.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full pt-4">
            <p className="text-sm text-center text-muted-foreground mb-4">
                Need help with your job search, addiction, or just want to get on your feet? We're here to help.
            </p>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">
                Get Assistance
            </Button>
        </CardContent>
    </Card>
  );
}
