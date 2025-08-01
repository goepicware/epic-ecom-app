
import React from 'react';
import { Coins, Trophy } from 'lucide-react';

interface PointsCardProps {
  availablePoints: number;
  totalEarnPoints: number;
  totalSpin: number
}

const PointsCard: React.FC<PointsCardProps> = ({ availablePoints, totalEarnPoints, totalSpin }) => {
  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Spin Wheel Points</h3>
        <Coins className="text-yellow-500" size={24} />
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Available Points:</span>
          <div className="flex items-center gap-1">
            <Coins className="text-yellow-500" size={16} />
            <span className="font-semibold text-gray-800">{availablePoints}</span>
          </div>
        </div>        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Spins:</span>
          <div className="flex items-center gap-1">
            <Trophy className="text-yellow-500" size={16} />
            <span className="font-semibold text-gray-800">{totalSpin}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Earn Point:</span>
          <div className="flex items-center gap-1">
            <Coins className="text-yellow-500" size={16} />
            <span className="font-semibold text-gray-800">{totalEarnPoints}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500 text-center">
          Each spin costs 1 loyalty point
        </p>
      </div>
    </div>
  );
};

export default PointsCard;
