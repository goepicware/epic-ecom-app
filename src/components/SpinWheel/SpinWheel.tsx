
import React, { useState, useRef, useEffect } from 'react';
import { RotateCcw, Zap, Calendar, Gift, HistoryIcon } from 'lucide-react';
import axios from "axios";
import { format } from "date-fns";
import { epciPayAPIURL } from "../Settings/Config";
import { encodeValue, calculateDays, getOutletID } from "../Settings/SettingHelper";
/* import PointsCard from "./PointsCard"; */
import Swal from "sweetalert2";
import "../../common/spinwheel/index-De4fchnV.css";
const voucherticket = require("../../common/images/voucher-ticket.svg").default;
const uniqueID = '24f86198-bc73-45e7-bf5a-dd200cfa3808';
interface Prize {
  id: number;
  text: string;
  color: string;
  percentage: number;
  probability: number;
}
interface Color {
  color: string;
}

interface FunctionList {
  onAction: (result: string) => void;
}

/* const prizes: Prize[] = [
  { id: 1, text: '5% OFF', color: '#007AFF', percentage: 5, probability: 37.5 },
  { id: 2, text: 'FREE APPETIZER', color: '#34C759', percentage: 0, probability: 12.5 },
  { id: 3, text: '50% OFF', color: '#FF9500', percentage: 50, probability: 37.5 },
  { id: 4, text: '10% OFF', color: '#FF3B30', percentage: 10, probability: 25 },
  { id: 5, text: '15% OFF', color: '#AF52DE', percentage: 15, probability: 12.5 },
  { id: 6, text: '10% OFF', color: '#FF2D92', percentage: 10, probability: 90 },
  { id: 7, text: '20% OFF', color: '#5AC8FA', percentage: 20, probability: 12.5 },
  { id: 8, text: '51% OFF', color: '#FFCC00', percentage: 51, probability: 37.5 }
]; */

const colors: Color[] = [
  { color: '#007AFF' },
  { color: '#34C759' },
  { color: '#FF9500' },
  { color: '#FF3B30' },
  { color: '#AF52DE' },
  { color: '#FF2D92' },
  { color: '#5AC8FA' },
  { color: '#FFCC00' }
];

const SpinWheel: React.FC<FunctionList> = ({ onAction }) => {
  const [isSpinEnable, setIsSpinEnable] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('SpinWheel');


  const [isSpinning, setIsSpinning] = useState(false);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Prize | null>(null);
  const [showPrize, setShowPrize] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const [availablePoints, setAvailablePoints] = useState(0);
  const [totalEarnPoints, setTotalEarnPoints] = useState(0);
  const [totalSpin, setTotalSpin] = useState(0);
  const [myVoucherList, setMyVoucherList] = useState([]);


  useEffect(() => {
    checkSpinWheelEnable();
  }, []);

  /*  const generateVoucherCode = () => {
     return 'REST' + Math.random().toString(36).substr(2, 6).toUpperCase();
   };
  */

  const checkSpinWheelEnable = async () => {
    axios.get(`${epciPayAPIURL}customer/checkSpinWheelEnable?uniqueID=${uniqueID}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    ).then((res) => {
      const resultStatus = res.data?.status ?? '';
      if (resultStatus === 'ok') {
        const companyEnableSpinWheel = res.data?.companyEnableSpinWheel ?? false;
        if (companyEnableSpinWheel === true) {
          setIsSpinEnable(companyEnableSpinWheel);
          loadVoucherList();
          getSpinWheelPoints();
          getMySpinWheelVoucher();
        } else {
          console.log('ddsadadada')
         // onAction('/myaccount')
        }
      } else {

      }
    }).catch((error) => {
      onAction('/myaccount')
      console.error("Error fetching data:", error);
    });
  }

  const getMySpinWheelVoucher = async () => {
    axios.get(`${epciPayAPIURL}voucher/getMySpinWheelVoucher?uniqueID=${uniqueID}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    ).then((res) => {
      const resultStatus = res.data?.status ?? '';
      if (resultStatus === 'ok') {
        setMyVoucherList(res.data?.result ?? []);
      }
    }).catch((error) => {
      console.error("Error fetching data:", error);
    });
  }

  const loadVoucherList = async () => {
    axios.get(`${epciPayAPIURL}settings/getSettings/?uniqueID=${uniqueID}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    ).then((res) => {
      const resultStatus = res.data?.status ?? '';
      if (resultStatus === 'ok') {
        const result = res.data?.result ?? '';
        const companyspinwheelVoucher = (result !== "") ? result?.companyspinwheelVoucher ?? '' : '';
        if (companyspinwheelVoucher !== "") {
          const companyspinwheelVoucher_ = JSON.parse(companyspinwheelVoucher);
          const prizes_: any = [];
          if (companyspinwheelVoucher_.length > 0) {
            companyspinwheelVoucher_.map((item: any, index: number) => {
              prizes_.push({ id: index, voucherID: item.voucherID?.value, text: item.voucherCustomName, color: colors[index].color, percentage: 5, probability: 37.5 })
              return '';
            })
          }
          console.log(prizes_, 'prizes_prizes_')
          setPrizes(prizes_)
        }
      }
      console.log(res, 'resresresresres')
    }).catch((error) => {
      console.error("Error fetching data:", error);
    });
  }

  const getSpinWheelPoints = async () => {
    axios.get(`${epciPayAPIURL}customer/getSpinWheelPoints/?uniqueID=${uniqueID}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    ).then((res) => {
      console.log(res, 'resultresultresultresult')
      const resultStatus = res.data?.status ?? '';
      if (resultStatus === 'ok') {
        const result = res.data?.result ?? '';

        setAvailablePoints(result.availablePoints)
        setTotalEarnPoints(result.totalEarnPoints)
        setTotalSpin(result.totalSpin)
      }
      console.log(res, 'resresresresres')
    }).catch((error) => {
      console.error("Error fetching data:", error);
    });
  }



  const getRandomPrize = (): Prize => {
    const random = Math.random() * 100;
    console.log('Random number generated:', random);
    let cumulativeProbability = 0;

    for (let i = 0; i < prizes.length; i++) {
      const prize = prizes[i];
      cumulativeProbability += prize.probability;
      console.log(`Checking prize ${prize.text}: cumulative probability ${cumulativeProbability}`);
      if (random <= cumulativeProbability) {
        console.log(`Selected prize: ${prize.text}`);
        return prize;
      }
    }
    // Fallback to last prize if no match
    return prizes[prizes.length - 1];
  };

  const spin = () => {
    if (isSpinning) return;

    console.log('Spin button clicked, starting spin animation');
    setIsSpinning(true);
    setShowPrize(false);
    setWinner(null);

    const selectedPrize = getRandomPrize();
    console.log('Final selected prize:', selectedPrize);

    // Find the index of the selected prize in the array
    const prizeIndex = prizes.findIndex(p => p.id === selectedPrize.id);
    console.log('Prize index in array:', prizeIndex);

    const segmentAngle = 360 / prizes.length; // 45 degrees per segment
    console.log('Segment angle:', segmentAngle);

    // Calculate the center angle of the target segment
    // Segments start from 0 degrees (3 o'clock) and go clockwise
    const segmentCenterAngle = (prizeIndex * segmentAngle) + (segmentAngle / 2);
    console.log('Segment center angle:', segmentCenterAngle);

    // The pointer is at the top (12 o'clock = 270 degrees in standard math coordinates)
    // We need to calculate how much to rotate so the selected segment center aligns with the pointer
    const pointerAngle = 270;

    // Calculate the rotation needed to align the segment center with the pointer
    // We want: (currentRotation + additionalRotation) % 360 = pointerAngle - segmentCenterAngle
    let targetFinalAngle = pointerAngle - segmentCenterAngle;

    // Normalize to positive angle
    if (targetFinalAngle < 0) {
      targetFinalAngle += 360;
    }

    console.log('Target final angle:', targetFinalAngle);

    // Add multiple full rotations for visual effect (minimum 5 full rotations)
    const baseSpins = 1800; // 5 full rotations
    const currentAngle = rotation % 360;
    const angleDifference = targetFinalAngle - currentAngle;

    // Ensure we always rotate in the positive direction and add the base spins
    let finalRotation = rotation + baseSpins;
    if (angleDifference >= 0) {
      finalRotation += angleDifference;
    } else {
      finalRotation += (360 + angleDifference);
    }

    console.log('Current angle:', currentAngle);
    console.log('Angle difference:', angleDifference);
    console.log('Final rotation:', finalRotation);
    console.log('Final angle will be:', finalRotation % 360);

    setRotation(finalRotation);

    setTimeout(() => {
      console.log('Spin completed, showing prize:', selectedPrize);
      setWinner(selectedPrize);
      claimVoucher(selectedPrize);
    }, 4000);
  };
  const claimVoucher = (selectedPrize: any) => {
    const outletID = getOutletID();
    const postObject = {
      uniqueID: uniqueID,
      outletID: outletID,
      productID: encodeValue(selectedPrize.voucherID),
      productQty: 1,
      checkoutType: 'SpinWheel'
    };
    axios
      .post(epciPayAPIURL + "voucher/buyVoucher", postObject, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.data.status === "ok") {
          setShowPrize(true);
          setIsSpinning(false);
          getSpinWheelPoints();
          getMySpinWheelVoucher();

        } else {
           Swal.fire({
             title: "Error",
             html: res.data.message,
             icon: "error",
             customClass: {
               confirmButton: "btn btn-primary waves-effect waves-light",
             },
             buttonsStyling: false,
           });
          
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    console.log(selectedPrize, 'selectedPrizeselectedPrize')
  }
  const createWheelSegment = (index: number, prize: Prize) => {
    const segmentAngle = 360 / prizes.length;
    const startAngle = index * segmentAngle;
    const endAngle = (index + 1) * segmentAngle;

    const radius = 160;
    const centerX = 160;
    const centerY = 160;

    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startAngleRad);
    const y1 = centerY + radius * Math.sin(startAngleRad);
    const x2 = centerX + radius * Math.cos(endAngleRad);
    const y2 = centerY + radius * Math.sin(endAngleRad);

    const largeArcFlag = segmentAngle > 180 ? 1 : 0;

    const pathData = [
      `M ${centerX} ${centerY}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');

    const textAngle = startAngle + segmentAngle / 2;
    const textRadius = radius * 0.7;
    const textX = centerX + textRadius * Math.cos((textAngle * Math.PI) / 180);
    const textY = centerY + textRadius * Math.sin((textAngle * Math.PI) / 180);

    return (
      <g key={prize.id} className="transition-all duration-200 hover:brightness-110">
        <path
          d={pathData}
          fill={prize.color}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
          className="transition-all duration-200 hover:scale-105"
        />
        <text
          x={textX}
          y={textY}
          fill="white"
          fontSize="12"
          fontWeight="600"
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(${textAngle}, ${textX}, ${textY})`}
          className="pointer-events-none select-none"
        >
          {prize.text}
        </text>
      </g>
    );
  };
  if (isSpinEnable) {

    return (
      <div className="spinwheel-section">
        <div className="tab-menu">
          <div
            className="slider"
            style={{ transform: `translateX(${hoveredIndex * 100}%)` }}
          ></div>
          <div
            className={`tab ${activeTab === "SpinWheel" ? "active" : ""}`}
            onClick={() => { setHoveredIndex(0); setActiveTab('SpinWheel'); }}
          >
            Spin Wheel
          </div>
          <div
            className={`tab ${activeTab === "History" ? "active" : ""}`}
            onClick={() => { setHoveredIndex(1); setActiveTab('History'); }}
          >
            History
          </div>
        </div>
        {activeTab === "SpinWheel" &&
          <div>
            <h2>Spin Wheel and get Voucher</h2>
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              {/* Main wheel container */}
              <div className="relative">
                {/* Wheel */}
                <div
                  ref={wheelRef}
                  className="relative w-80 h-80 will-change-transform"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white/80 backdrop-blur-xl border border-gray-200 shadow-[0_8px_32px_rgba(0,0,0,0.1)] overflow-hidden">
                    <svg width="320" height="320" viewBox="0 0 320 320" className="w-full h-full">
                      {prizes.map((prize, index) => createWheelSegment(index, prize))}
                    </svg>
                  </div>

                  {/* Center hub */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full border border-gray-200 shadow-inner flex items-center justify-center z-10">
                    <RotateCcw size={16} className="text-gray-600" />
                  </div>
                </div>

                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-1 h-16 bg-white rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)] z-10"></div>
              </div>

              {/* Spin button */}
              <button
                onClick={spin}
                disabled={(isSpinning === true || availablePoints <= 0) ? true : false}
                className={`button orng-btn mt-10 px-8 py-4 text-lg rounded-xl shadow-[0_4px_20px_rgba(0,122,255,0.4)] transition-all duration-300 ${(isSpinning === true || availablePoints <= 0)
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-105 hover:shadow-[0_10px_40px_rgba(0,122,255,0.3)] active:scale-95'
                  }`}
              >
                {availablePoints <= 0 ? 'Completed' : (isSpinning ? 'Spinning...' : 'Spin the Wheel!')}
              </button>

              {/* Prize modal */}
              {showPrize && winner && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ zIndex: '99' }}>
                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-[prize-appear_0.6s_cubic-bezier(0.68,-0.55,0.27,1.55)]">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Congratulations!</h2>
                    <p className="text-lg text-gray-600 mb-4">
                      You won: <span className="font-semibold" style={{ color: winner.color }}>{winner.text}</span>
                    </p>
                    <button
                      onClick={() => setShowPrize(false)}
                      className="button orng-btn px-6 py-2 rounded-lg font-semibold transition-colors duration-200"
                    >
                      Claim Prize
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <div className="bg-white/80 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-105 available-points">
                <div className="rounded-lg border bg-card text-card-foreground glass-morphism border-none shadow-lg grid-cols-1">
                  <div className="p-6 text-center">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <div className="text-3xl font-bold text-blue-600 mb-2">{availablePoints}</div>
                    <p className="text-gray-600">Available Points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>}
        {activeTab === "History" &&
          <div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="rounded-lg border bg-card text-card-foreground glass-morphism border-none shadow-lg">
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">{availablePoints}</div>
                  <p className="text-gray-600">Available Points</p>
                </div>
              </div>

              <div className="rounded-lg border bg-card text-card-foreground glass-morphism border-none shadow-lg">
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {totalSpin}
                  </div>
                  <p className="text-gray-600">Total Spins</p>
                </div>
              </div>

              <div className="rounded-lg border bg-card text-card-foreground glass-morphism border-none shadow-lg">
                <div className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {totalEarnPoints}
                  </div>
                  <p className="text-gray-600">Total Earned Point</p>
                </div>
              </div>
            </div>

            <div className="voucher-history-list">
              <div className="glass-morphism border-none shadow-lg ">
                {myVoucherList.length > 0 &&
                  <div>
                    <h3 className="voucher-history-title text-2xl font-semibold leading-none tracking-tight flex items-center space-x-2">
                      <HistoryIcon className="w-5 h-5 text-blue-600" />
                      <span>All Spins</span>
                    </h3>
                  </div>}
                <div>

                  {myVoucherList.length > 0 ? (
                    <div className="space-y-4">

                      {myVoucherList.map((item: any, index) => {
                        var validity = calculateDays(new Date(), item.voucherProductEndDate);
                        return (
                          <div
                            className="flex items-center justify-between p-4 bg-white rounded-xl border hover:shadow-md transition-shadow history-main-list" key={index}
                          >
                            <div className="flex items-center space-x-4">
                              <div className="text-2xl">
                                <img src={voucherticket} alt="Voucher" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900 mb-1 text-align-left vouch-title font-17">
                                  {item.voucherProductName}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 text-align-left">
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span className="font-17">{format(new Date(item.createdAt), "MMM d, yyyy")}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                              <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-blue-100 text-blue-800 border-blue-200 font-17 ${validity === 'Expired' ? 'expired-voucher' : (item.voucherStatus === 'Active' ? 'active-voucher' : 'used-voucher')}`}>
                                {validity === 'Expired' ? 'Expired' : item.voucherStatus}
                              </div>

                              <p className="text-xs text-gray-500 font-17">
                                Expires {format(new Date(item.voucherProductEndDate), "MMM d, yyyy")}
                              </p>

                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 pb-4">
                      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Gift className="w-10 h-10 " />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No spins yet</h3>
                      <p className="text-gray-500 mb-4">Start spinning to build your history!</p>
                      <button
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Go to Spin Wheel
                      </button>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  } else {
    return '';
  }
};

export default SpinWheel;
