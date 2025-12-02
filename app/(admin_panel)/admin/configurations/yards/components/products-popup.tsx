'use client';

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function ProductsPopup({
  children,
  products,
}: {
  children: React.ReactNode;
  products: any[];
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-64 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 animate-fade-in"
      >
        <div className="flex flex-col gap-2">
          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
            Assigned Products
          </h4>
          <Separator className="my-1" />
          {products.length > 0 ? (
            <ul className="max-h-48 overflow-y-auto space-y-1 text-sm text-gray-700 dark:text-gray-300 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800">
              {products.map((p, i) => (
                <li
                  key={i}
                  className="hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors duration-150 cursor-pointer"
                >
                  {p.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">No products assigned</p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
