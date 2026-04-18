'use client';

import { Factory, BadgeCheck, MapPin } from 'lucide-react';

export function LicenseInfo() {
  return (
    <div className="bg-gray-50 rounded-lg p-6 border">
      <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
        <Factory className="w-5 h-5 text-primary" />
        SQ NAFIS CROP CARE LIMITED
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">Factory Address</p>
            <p className="text-sm text-gray-600">
              Gazaria, Gabtali, Gabtali, Bogura, Rajshahi
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <BadgeCheck className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">License Number</p>
              <p className="text-sm text-gray-600">10-40-1-048-00001</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <BadgeCheck className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Registration Number</p>
              <p className="text-sm text-gray-600">10-40-1-048-00001</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <BadgeCheck className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">Category</p>
            <p className="text-sm text-gray-600">B (Factory)</p>
          </div>
        </div>
      </div>
    </div>
  );
}