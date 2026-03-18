/*import logo from './logo.svg';*/
import { Analytics } from "@vercel/analytics/react";
import React, { useState, useMemo } from 'react';
import { 
  AlertCircle, CheckCircle2, Package, CalendarDays, 
  Download, Sparkles, X, Loader2, Plus, ShoppingCart, Trash2, CalendarOff, Eye, ChevronLeft, ChevronRight
} from "lucide-react";

// --- DỮ LIỆU BAN ĐẦU ---
const initialLots = [
  { id: 1, lotNumber: '01-02', model: 'STO-0724-19240204A-STO-240723-FRAME', input: '30/01/2026', output: '30/03/2026', pnl: 5, ivh: 20, sto: 15, qty1037: 60, qty1010: 140, start1037: '02/02/2026', outer1037: '05/02/2026', end1037: '07/02/2026', start1010: '10/02/2026', end1010: '-' },
  { id: 2, lotNumber: '01-02', model: 'STO-0923-19250109A-YX010', input: '05/02/2026', output: '03/04/2026', pnl: 5, ivh: 14, sto: 16, qty1037: 45, qty1010: 150, start1037: '07/02/2026', outer1037: '11/02/2026', end1037: '13/02/2026', start1010: '23/02/2026', end1010: '-' },
  { id: 3, lotNumber: '01-02-03', model: 'STO-260205-19240104B-YX006', input: '05/02/2026', output: '27/03/2026', pnl: 8, ivh: 22, sto: 12, qty1037: 104, qty1010: 176, start1037: '08/02/2026', outer1037: '13/02/2026', end1037: '23/02/2026', start1010: '25/02/2026', end1010: '-' },
  { id: 4, lotNumber: '71-01', model: 'STO-260205-19240104B-YX006', input: '24/02/2026', output: '07/04/2026', pnl: 3, ivh: 0, sto: 12, qty1037: 39, qty1010: 66, start1037: '26/02/2026', outer1037: '03/03/2026', end1037: '05/03/2026', start1010: '07/03/2026', end1010: '-' },
  { id: 5, lotNumber: '01-02', model: 'STO-260211-04201-AURORA8KA-A100', input: '11/02/2026', output: '31/03/2026', pnl: 5, ivh: 0, sto: 10, qty1037: 60, qty1010: 90, start1037: '13/02/2026', outer1037: '25/02/2026', end1037: '27/02/2026', start1010: '02/03/2026', end1010: '-' },
  { id: 6, lotNumber: '01', model: 'STO-STEP14-260304-26625210573M-D1-GAD1621-MLO', input: '04/03/2026', output: '24/03/2026', pnl: 2, ivh: 0, sto: 4, qty1037: 10, qty1010: 12, start1037: '06/03/2026', outer1037: '10/03/2026', end1037: '12/03/2026', start1010: '14/03/2026', end1010: '-' },
  { id: 7, lotNumber: '01', model: 'STO-STEP14-0923-19250109A-YX010', input: '05/03/2026', output: '24/04/2026', pnl: 3, ivh: 0, sto: 16, qty1037: 27, qty1010: 90, start1037: '07/03/2026', outer1037: '11/03/2026', end1037: '13/03/2026', start1010: '16/03/2026', end1010: '-' },
  { id: 8, lotNumber: '01', model: 'STO-STEP14-260306-00076H-MLO', input: '09/03/2026', output: '26/03/2026', pnl: 2, ivh: 0, sto: 3, qty1037: 16, qty1010: 8, start1037: '11/03/2026', outer1037: '14/03/2026', end1037: '16/03/2026', start1010: '18/03/2026', end1010: '-' },
  { id: 9, lotNumber: '01-02-03', model: 'STO-STEP14-260307-15260201A-STO', input: '09/03/2026', output: '23/04/2026', pnl: 9, ivh: 0, sto: 14, qty1037: 90, qty1010: 234, start1037: '11/03/2026', outer1037: '14/03/2026', end1037: '16/03/2026', start1010: '18/03/2026', end1010: '-' },
  { id: 10, lotNumber: '01', model: 'STO-STEP14-260312-N2494', input: '14/03/2026', output: '30/03/2026', pnl: 2, ivh: 0, sto: 1, qty1037: 20, qty1010: 0, start1037: '18/03/2026', outer1037: '21/03/2026', end1037: '24/03/2026', start1010: '-', end1010: '-' }
];

const initialInventory = [
  { id: '1037', name: 'PPG 1037', stock: 584, safeStock: 2000, onOrder: 0, leadTime: 30, orderDate: '' },
  { id: '1010', name: 'PPG 1010', stock: 316, safeStock: 2500, onOrder: 0, leadTime: 30, orderDate: '' },
];

const initialHolidays = [
  { id: 1, type: 'OFF', start: '14/02/2026', end: '22/02/2026', desc: 'Nghỉ lễ / Bảo trì xưởng' },
  { id: 2, type: 'WORK', start: '29/03/2026', end: '29/03/2026', desc: 'Tăng ca Chủ Nhật' }
];

// --- HÀM HỖ TRỢ XỬ LÝ NGÀY ---
const parseDateToJS = (dateStr) => {
  if (!dateStr) return new Date();
  const [day, month, year] = dateStr.split('/');
  return new Date(Number(year), Number(month) - 1, Number(day));
};

const formatDateToVN = (dateObj) => {
  const d = String(dateObj.getDate()).padStart(2, '0');
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const y = dateObj.getFullYear();
  return `${d}/${m}/${y}`;
};

const addDays = (dateObj, days) => {
  const result = new Date(dateObj);
  result.setDate(result.getDate() + days);
  return result;
};

const getLocalYMD = (dateObj) => {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const isExplicitWorkDay = (dateObj, holidays) => {
  const time = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
  for (const h of holidays) {
    if (h.type !== 'WORK' || !h.start || !h.end) continue;
    const s = parseDateToJS(h.start).getTime();
    const e = parseDateToJS(h.end).getTime();
    if (time >= s && time <= e) return true;
  }
  return false;
};

const isHoliday = (dateObj, holidays) => {
  const time = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()).getTime();
  if (isExplicitWorkDay(dateObj, holidays)) return false;
  for (const h of holidays) {
    if (h.type !== 'OFF' || !h.start || !h.end) continue;
    const s = parseDateToJS(h.start).getTime();
    const e = parseDateToJS(h.end).getTime();
    if (time >= s && time <= e) return true;
  }
  if (dateObj.getDay() === 0) return true; 
  return false;
};

const addWorkingDays = (startDateObj, daysToAdd, holidays) => {
  let result = new Date(startDateObj);
  let added = 0;
  while (added < daysToAdd) {
    result.setDate(result.getDate() + 1);
    if (!isHoliday(result, holidays)) {
      added++;
    }
  }
  return result;
};

const getBuildName = (n) => {
  if (n === 1) return '1ST';
  if (n === 2) return '2ND';
  if (n === 3) return '3RD';
  return `${n}TH`;
};

const calculateExpectedDate = (dateStr, leadTimeDays) => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '-';
  date.setDate(date.getDate() + Number(leadTimeDays));
  return formatDateToVN(date);
};

// --- LOGIC TÍNH TOÁN LỊCH TRÌNH CÓ TÙY CHỈNH THỦ CÔNG ---
const calculateLotSchedule = (lot, holidays) => {
  const inputDate = parseDateToJS(lot.input);
  const scheduleArray = [];
  const customDates = lot.customDates || {}; // Lấy dữ liệu ngày tùy chỉnh của lot
  
  let safeInput = new Date(inputDate);
  while(isHoliday(safeInput, holidays)) safeInput.setDate(safeInput.getDate() + 1);

  let start1037Str = lot.start1037 || formatDateToVN(addWorkingDays(safeInput, 2, holidays));
  let start1010Str = lot.start1010 || formatDateToVN(addWorkingDays(safeInput, 9, holidays));
  let end1037Str = lot.end1037 || '-';
  let end1010Str = '-'; 

  // Logic 1037
  if (lot.qty1037 > 0 && lot.pnl > 0) {
    let d2 = parseDateToJS(start1037Str);
    start1037Str = formatDateToVN(d2);

    let d5, d7;
    if (lot.end1037 && lot.end1037 !== '-') {
      d7 = parseDateToJS(lot.end1037);
      
      if (lot.outer1037 && lot.outer1037 !== '') {
        d5 = parseDateToJS(lot.outer1037); 
      } else {
        const midTime = d2.getTime() + (d7.getTime() - d2.getTime()) / 2;
        d5 = new Date(midTime);
        d5.setHours(0, 0, 0, 0); 
        d5.setDate(d5.getDate() + 1); 
        while(isHoliday(d5, holidays)) d5.setDate(d5.getDate() + 1);
        if (d5.getTime() > d7.getTime()) d5 = new Date(d7.getTime());
      }
    } else {
      d5 = addWorkingDays(d2, 4, holidays);
      d7 = addWorkingDays(d2, 5, holidays);
    }
    
    end1037Str = formatDateToVN(d7);

    const amtDay5 = lot.pnl * 2;
    const amtDay7 = lot.pnl * 2;
    const amtDay2 = Math.max(0, lot.qty1037 - (amtDay5 + amtDay7));

    scheduleArray.push({ date: d2, qty1037: amtDay2, qty1010: 0, stage: 'Inner Layer (Hot Press 1st)', type: '1037', fieldKey: 'start1037', isCustom: !!lot.start1037 });
    scheduleArray.push({ date: d5, qty1037: amtDay5, qty1010: 0, stage: 'Outer Layer (Inner Layer Imaging)', type: '1037', fieldKey: 'outer1037', isCustom: !!lot.outer1037 });
    scheduleArray.push({ date: d7, qty1037: amtDay7, qty1010: 0, stage: 'STO1 (BUILD 1ST)', type: '1037', fieldKey: 'end1037', isCustom: !!lot.end1037 });
  }

  // Logic 1010
  if (lot.qty1010 > 0 && lot.pnl > 0) {
    let d1010 = parseDateToJS(start1010Str);
    start1010Str = formatDateToVN(d1010);

    let remaining1010 = lot.qty1010;
    const stepAmt = lot.pnl * 2; 

    let currentDate = new Date(d1010);
    let lastDay = null;
    let count = 1;

    while (remaining1010 > 0) {
      const consumeAmt = Math.min(stepAmt, remaining1010);
      const stageName = `STO${count + 1} (BUILD ${getBuildName(count + 1)})`;
      const fieldKey = count === 1 ? 'start1010' : `custom_${stageName}`;
      let isCustom = false;

      // KIỂM TRA TÙY CHỈNH: Nếu người dùng có ép ngày cho STO này, lấy ngày đó làm mốc
      if (count > 1 && customDates[stageName]) {
        currentDate = parseDateToJS(customDates[stageName]);
        isCustom = true;
      }

      scheduleArray.push({ date: new Date(currentDate), qty1037: 0, qty1010: consumeAmt, stage: stageName, type: '1010', fieldKey, isCustom: count === 1 ? !!lot.start1010 : isCustom });
      
      remaining1010 -= consumeAmt;
      count++;
      lastDay = new Date(currentDate);

      // CÁC BƯỚC SAU SẼ ĐƯỢC CỘNG TIẾP TỪ CỘT MỐC GẦN NHẤT (dù là máy tính hay là do người dùng ép)
      if (remaining1010 > 0) {
        currentDate = addWorkingDays(currentDate, 2, holidays);
      }
    }
    if (lastDay) end1010Str = formatDateToVN(lastDay); 
  }

  scheduleArray.sort((a, b) => a.date.getTime() - b.date.getTime());

  return { start1037: start1037Str, end1037: end1037Str, start1010: start1010Str, end1010: end1010Str, scheduleArray };
};

const MarkdownRenderer = ({ text }) => {
  if (!text) return null;
  return (
    <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
      {text.split('\n').map((line, idx) => {
        if (!line.trim()) return <br key={idx} />;
        const formattedLine = line.split(/(\*\*.*?\*\*)/g).map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="text-gray-900">{part.slice(2, -2)}</strong>;
          return part;
        });
        if (line.startsWith('* ') || line.startsWith('- ')) return <li key={idx} className="ml-4 list-disc">{formattedLine.slice(1)}</li>;
        return <p key={idx}>{formattedLine}</p>;
      })}
    </div>
  );
};

export default function App() {
  const [lots, setLots] = useState(initialLots);
  const [inventory, setInventory] = useState(initialInventory);
  const [holidays, setHolidays] = useState(initialHolidays);
  
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  
  const [isAddLotModalOpen, setIsAddLotModalOpen] = useState(false);
  const [newLot, setNewLot] = useState({
    lotNumber: '', model: '', input: '', output: '', pnl: 0, ivh: 0, sto: 0, qty1037: '', qty1010: '', outer1037: ''
  });
  
  const [newHoliday, setNewHoliday] = useState({ type: 'OFF', start: '', end: '', desc: '' });
  
  // Đã sửa lỗi lưu toàn bộ object để Modal có thể reactively tự động cập nhật lại khi sửa ngày
  const [selectedLotId, setSelectedLotId] = useState(null);

  const [currentMonthDate, setCurrentMonthDate] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  const processedLots = useMemo(() => {
    return lots.map(lot => {
      const { start1037, end1037, start1010, end1010, scheduleArray } = calculateLotSchedule(lot, holidays);
      return { ...lot, start1037, end1037, start1010, end1010, scheduleArray };
    });
  }, [lots, holidays]);

  const selectedLotDetails = useMemo(() => {
    return processedLots.find(l => l.id === selectedLotId);
  }, [processedLots, selectedLotId]);

  const masterTimeline = useMemo(() => {
    const timeline = {}; 
    processedLots.forEach(lot => {
      lot.scheduleArray.forEach(entry => {
        const dateStr = getLocalYMD(entry.date);
        if (!timeline[dateStr]) timeline[dateStr] = { 1037: 0, 1010: 0 };
        timeline[dateStr][1037] += entry.qty1037;
        timeline[dateStr][1010] += entry.qty1010;
      });
    });
    return timeline;
  }, [processedLots]);

  const dashboardData = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return inventory.map(inv => {
      const type = inv.id;
      const startStock = Number(inv.stock) || 0;
      const onOrder = Number(inv.onOrder) || 0;
      const leadTime = Number(inv.leadTime) || 0;
      const safeStock = Number(inv.safeStock) || 0;
      
      let simulatedStock = startStock + onOrder;
      let demandInLeadTime = 0;
      let daysRemaining = 999;
      let exhaustionDateStr = '-';

      for (let i = 0; i < 365; i++) {
        const simDate = addDays(today, i);
        const dateStr = getLocalYMD(simDate);
        const dailyNeed = masterTimeline[dateStr]?.[type] || 0;

        if (i < leadTime) demandInLeadTime += dailyNeed;
        
        simulatedStock -= dailyNeed;

        if (simulatedStock <= 0 && daysRemaining === 999) {
          daysRemaining = i;
          exhaustionDateStr = formatDateToVN(simDate);
        }
      }

      const isDanger = (startStock + onOrder - demandInLeadTime) < safeStock;
      return { ...inv, demandInLeadTime, daysRemaining, exhaustionDateStr, isDanger };
    });
  }, [masterTimeline, inventory]);

  const calendarDays = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    let startPadding = firstDay.getDay() - 1;
    if (startPadding < 0) startPadding = 6; 

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startPadding - 1; i >= 0; i--) {
      days.push({ date: new Date(year, month - 1, prevMonthLastDay - i), isCurrentMonth: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  }, [currentMonthDate]);

  const orderEventsMap = useMemo(() => {
    const map = {};
    inventory.forEach(inv => {
      if (inv.orderDate && Number(inv.onOrder) > 0) {
        const orderDateStr = inv.orderDate;
        const orderDateJS = new Date(orderDateStr);
        if (isNaN(orderDateJS.getTime())) return;

        const arrivalDateJS = new Date(orderDateJS);
        arrivalDateJS.setDate(arrivalDateJS.getDate() + Number(inv.leadTime));
        const arrivalDateStr = getLocalYMD(arrivalDateJS);

        if (!map[orderDateStr]) map[orderDateStr] = [];
        map[orderDateStr].push({ type: 'ORDER', name: inv.id, qty: inv.onOrder });

        if (!map[arrivalDateStr]) map[arrivalDateStr] = [];
        map[arrivalDateStr].push({ type: 'ARRIVAL', name: inv.id, qty: inv.onOrder });
      }
    });
    return map;
  }, [inventory]);

  const handlePrevMonth = () => setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentMonthDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

  const handleInventoryChange = (id, field, value) => {
    setInventory(prev => prev.map(inv => {
      if (inv.id === id) {
        if (field === 'orderDate') return { ...inv, [field]: value };
        return { ...inv, [field]: value === '' ? '' : Number(value) };
      }
      return inv;
    }));
  };

  const handleLotDateChange = (id, field, value) => {
    if (!value) {
      setLots(lots.map(lot => {
        if (lot.id === id) {
          const newLot = { ...lot };
          delete newLot[field];
          return newLot;
        }
        return lot;
      }));
      return;
    }
    const [y, m, d] = value.split('-');
    const formattedDate = `${d}/${m}/${y}`;
    setLots(lots.map(lot => lot.id === id ? { ...lot, [field]: formattedDate } : lot));
  };
  const handleDeleteLot = (id) => {
  setLots(prev => prev.filter(lot => lot.id !== id));
};
  // Hàm xử lý việc người dùng tinh chỉnh trực tiếp ngày STO trong bảng Modal
  const handleStageDateChange = (lotId, fieldKey, stageName, newValueStr) => {
    setLots(prevLots => prevLots.map(lot => {
      if (lot.id !== lotId) return lot;

      if (!newValueStr) {
        if (['start1037', 'outer1037', 'end1037', 'start1010'].includes(fieldKey)) {
          const newLot = { ...lot };
          delete newLot[fieldKey];
          return newLot;
        } else {
          const newLot = { ...lot };
          if (newLot.customDates) {
            const newCustomDates = { ...newLot.customDates };
            delete newCustomDates[stageName];
            newLot.customDates = newCustomDates;
          }
          return newLot;
        }
      }

      const [y, m, d] = newValueStr.split('-');
      const formattedDate = `${d}/${m}/${y}`;

      if (['start1037', 'outer1037', 'end1037', 'start1010'].includes(fieldKey)) {
        return { ...lot, [fieldKey]: formattedDate };
      } else {
        return {
          ...lot,
          customDates: {
            ...(lot.customDates || {}),
            [stageName]: formattedDate
          }
        };
      }
    }));
  };

  const handleLotChange = (id, field, value) => {
    setLots(lots.map(lot => {
      if (lot.id === id) {
        const isNumericField = ['pnl', 'ivh', 'sto', 'qty1037', 'qty1010'].includes(field);
        return { ...lot, [field]: isNumericField ? (value === '' ? '' : Number(value)) : value };
      }
      return lot;
    }));
  };

  const handleAddLot = (e) => {
    e.preventDefault();
    const formatToVN = (dateStr) => {
      if (!dateStr) return '';
      const [y, m, d] = dateStr.split('-');
      return `${d}/${m}/${y}`;
    };

    const lotToAdd = {
      ...newLot,
      id: lots.length > 0 ? Math.max(...lots.map(l => l.id)) + 1 : 1,
      input: formatToVN(newLot.input),
      output: formatToVN(newLot.output),
      qty1037: Number(newLot.qty1037) || 0,
      qty1010: Number(newLot.qty1010) || 0,
      pnl: Number(newLot.pnl) || 0,
      ivh: Number(newLot.ivh) || 0,
      sto: Number(newLot.sto) || 0,
    };
    setLots([...lots, lotToAdd]);
    setIsAddLotModalOpen(false);
    setNewLot({ lotNumber: '', model: '', input: '', output: '', pnl: 0, ivh: 0, sto: 0, qty1037: '', qty1010: '', outer1037: '' });
  };

  const handleAddHoliday = (e) => {
    e.preventDefault();
    if(!newHoliday.start || !newHoliday.end) return;
    const formatToVN = (dateStr) => {
      const [y, m, d] = dateStr.split('-');
      return `${d}/${m}/${y}`;
    };
    const hToAdd = {
      id: holidays.length > 0 ? Math.max(...holidays.map(h => h.id)) + 1 : 1,
      type: newHoliday.type,
      start: formatToVN(newHoliday.start),
      end: formatToVN(newHoliday.end),
      desc: newHoliday.desc || (newHoliday.type === 'WORK' ? 'Tăng ca / Làm bù' : 'Nghỉ lễ')
    };
    setHolidays([...holidays, hToAdd]);
    setNewHoliday({ type: 'OFF', start: '', end: '', desc: '' });
  };
  
  const handleDeleteHoliday = (id) => setHolidays(holidays.filter(h => h.id !== id));

  const exportToCSV = () => {
    let csvContent = "\uFEFFBẢNG QUẢN LÝ TỒN KHO PPG - THEO LỊCH TRÌNH CÔNG ĐOẠN\n\n";
    
    csvContent += "Mã NVL,Tồn kho hiện tại,Tồn an toàn,Đang đặt hàng,Nhu cầu trong Lead Time,Số ngày dùng còn lại,Ngày cạn kiệt,CẢNH BÁO\n";
    dashboardData.forEach(inv => {
      csvContent += `${inv.name},${inv.stock},${inv.safeStock},${inv.onOrder},${inv.demandInLeadTime},${inv.daysRemaining === 999 ? '> 365' : inv.daysRemaining},${inv.exhaustionDateStr},${inv.isDanger ? 'ĐẶT HÀNG NGAY' : 'AN TOÀN'}\n`;
    });
    
    csvContent += "\n\nBẢNG ĐẶT HÀNG NGUYÊN VẬT LIỆU (PO)\n";
    inventory.forEach(inv => {
      const expectedDate = (inv.orderDate && Number(inv.onOrder) > 0) ? calculateExpectedDate(inv.orderDate, inv.leadTime) : '-';
      csvContent += `${inv.name},${inv.orderDate},${inv.onOrder},${inv.leadTime},${expectedDate}\n`;
    });

    csvContent += "\n\nBẢNG QUẢN LÝ LỊCH ĐẶC BIỆT (NGHỈ LỄ / LÀM BÙ)\n";
    csvContent += "Loại,Từ ngày,Đến ngày,Lý do\n";
    holidays.forEach(h => csvContent += `${h.type === 'WORK' ? 'Làm bù' : 'Nghỉ lễ'},${h.start},${h.end},${h.desc}\n`);

    csvContent += "\n\nCHI TIẾT CÁC LOT HÀNG ĐANG CHẠY\n";
    csvContent += "STT,Số Lot,Model,Ngày Input,Ngày xuất hàng,PNL,STO Layer,Tổng 1037,Tổng 1010\n";
    processedLots.forEach((lot, index) => {
      csvContent += `${index + 1},${lot.lotNumber},${lot.model},${lot.input},${lot.output},${lot.pnl},${lot.sto},${lot.qty1037},${lot.qty1010}\n`;
    });

    csvContent += "\n\nLỊCH TRÌNH TIÊU HAO CHI TIẾT TỪNG CÔNG ĐOẠN\n";
    csvContent += "Số Lot,Model,Ngày thực hiện,Loại PPG,Tên Công Đoạn,Số lượng tiêu hao\n";
    processedLots.forEach(lot => {
      lot.scheduleArray.forEach(entry => {
        const qty = entry.type === '1037' ? entry.qty1037 : entry.qty1010;
        csvContent += `${lot.lotNumber},${lot.model},${formatDateToVN(entry.date)},PPG ${entry.type},${entry.stage},${qty.toFixed(2)}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "QuanLy_TonKho_PPG_PhanTichCongDoan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const callGeminiAI = async () => {
    setIsAiModalOpen(true);
    setIsAiLoading(true);
    setAiResponse("");

    const apiKey = ""; 
    const inventoryContext = dashboardData.map(inv => {
      const expectedArrival = (inv.orderDate && inv.onOrder > 0) ? calculateExpectedDate(inv.orderDate, inv.leadTime) : 'Chưa đặt';
      return `${inv.name}: Tồn ${inv.stock}, Tồn an toàn ${inv.safeStock}. Nhu cầu trong ${inv.leadTime} ngày tới là ${inv.demandInLeadTime}. Ngày cạn kiệt: ${inv.exhaustionDateStr}. Đang đặt: ${inv.onOrder} (Dự kiến về: ${expectedArrival}).`;
    }).join('\n');

    const prompt = `Tôi là quản lý kho xưởng FAB2 sản xuất PCB.
    Dữ liệu mô phỏng tồn kho & nhu cầu thực tế sắp tới:
    ${inventoryContext}
    
    Hãy đóng vai chuyên gia quản lý chuỗi cung ứng:
    1. Đánh giá nhanh rủi ro dựa trên "Nhu cầu trong Lead time" so với Tồn kho.
    2. Đưa ra đề xuất số lượng cần đặt hàng bổ sung ngay lập tức.
    3. Viết một báo cáo ngắn gọn để tôi gửi Giám đốc duyệt mua hàng.
    Trả lời bằng tiếng Việt, súc tích.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: "Bạn là chuyên gia chuỗi cung ứng. Phân tích dựa trên dự báo mô phỏng nhu cầu." }] }
        })
      });

      if (!response.ok) throw new Error("Lỗi kết nối API");
      const data = await response.json();
      setAiResponse(data.candidates?.[0]?.content?.parts?.[0]?.text || "Lỗi phản hồi.");
    } catch (error) {
      setAiResponse("Lỗi kết nối AI.");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans pb-20">
      <div className="max-w-[1450px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Package className="text-blue-600" />
              Hệ thống Quản lý Tồn kho PPG - Mô Phỏng PNL
            </h1>
            <p className="text-gray-500 text-sm mt-1">Nâng cấp: Lịch trình STO hoàn toàn có thể tinh chỉnh thủ công cho từng công đoạn.</p>
          </div>
          <div className="text-right flex items-center gap-3">
            <button onClick={exportToCSV} className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
              <Download size={16} /> Xuất File CSV
            </button>
          </div>
        </div>

        {/* Modal Chi tiết Lịch trình của 1 Lot */}
        {selectedLotDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-[800px] overflow-hidden flex flex-col max-h-[85vh]">
              <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
                <h3 className="font-bold flex items-center gap-2">
                  <CalendarDays size={18} />
                  Chi tiết Lịch trình - Số Lot: {selectedLotDetails.lotNumber}
                </h3>
                <button onClick={() => setSelectedLotId(null)} className="hover:bg-blue-500 p-1 rounded-full"><X size={20} /></button>
              </div>
              
              <div className="p-4 bg-gray-50 border-b border-gray-200 grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-500">Model:</span> <span className="font-mono font-bold text-gray-800">{selectedLotDetails.model}</span></div>
                <div><span className="text-gray-500">Ngày Input:</span> <span className="font-bold text-gray-800">{selectedLotDetails.input}</span></div>
                <div><span className="text-gray-500">Hệ số PNL:</span> <span className="font-bold text-gray-800">{selectedLotDetails.pnl}</span></div>
                <div><span className="text-gray-500">Tổng PPG:</span> <span className="font-bold text-blue-700">1037 ({selectedLotDetails.qty1037} ea)</span> | <span className="font-bold text-indigo-700">1010 ({selectedLotDetails.qty1010} ea)</span></div>
              </div>

              <div className="overflow-y-auto flex-1 p-0">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center sticky top-0 shadow-sm z-10">
                    <tr>
                      <th className="px-4 py-3 text-left w-[250px]">Ngày xuất kho (Tùy chỉnh)</th>
                      <th className="px-4 py-3 text-left w-[120px]">Loại PPG</th>
                      <th className="px-4 py-3 text-left">Tên Công Đoạn</th>
                      <th className="px-4 py-3 text-right">Tiêu hao (ea)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100 text-sm text-center">
                    {selectedLotDetails.scheduleArray.length === 0 && (
                      <tr><td colSpan="4" className="py-8 text-gray-400">Không có dữ liệu lịch trình cho Lot này.</td></tr>
                    )}
                    {selectedLotDetails.scheduleArray.map((entry, idx) => (
                      <tr key={idx} className="hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-2 font-semibold text-left">
                          <div className="flex items-center gap-2">
                            <input
                              type="date"
                              value={getLocalYMD(entry.date)}
                              onChange={(e) => handleStageDateChange(selectedLotDetails.id, entry.fieldKey, entry.stage, e.target.value)}
                              className={`bg-transparent border border-gray-300 hover:border-blue-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded px-2 py-1 focus:outline-none transition-all cursor-pointer ${entry.isCustom ? 'text-orange-600 font-bold bg-orange-50' : 'text-gray-800'}`}
                              title="Nhấn để tùy chỉnh thủ công ngày này"
                            />
                            {entry.isCustom && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold" title="Cột mốc này đã được chỉnh sửa thủ công">Tùy chỉnh</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-left">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${entry.type === '1037' ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                            PPG {entry.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-700 text-left">{entry.stage}</td>
                        <td className="px-4 py-3 font-bold text-right text-gray-800 text-base">
                          {entry.type === '1037' ? entry.qty1037.toFixed(2) : entry.qty1010.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bảng Dashboard Cảnh báo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-gray-800 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertCircle size={20} className="text-orange-400" />
              Bảng Dashboard Cảnh báo (Mô phỏng tương lai)
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                <tr>
                  <th className="px-6 py-4 text-left">Mã NVL</th>
                  <th className="px-6 py-4">Tồn kho hiện tại</th>
                  <th className="px-6 py-4">Tồn an toàn</th>
                  <th className="px-6 py-4">Đang đặt hàng</th>
                  <th className="px-6 py-4 bg-blue-50 text-blue-800">Nhu cầu trong Lead Time</th>
                  <th className="px-6 py-4 bg-orange-50 text-orange-800">Số ngày dùng còn lại</th>
                  <th className="px-6 py-4 bg-orange-50 text-orange-800">Ngày cạn kiệt (Giả lập)</th>
                  <th className="px-6 py-4">Trạng thái (Cảnh báo)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm text-center">
                {dashboardData.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-left font-bold text-gray-800">{inv.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="number" value={inv.stock} onChange={(e) => handleInventoryChange(inv.id, 'stock', e.target.value)} className="w-24 text-center border-b-2 border-dashed border-gray-400 focus:outline-none focus:border-blue-500 font-bold text-lg text-blue-600 bg-transparent" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="number" value={inv.safeStock} onChange={(e) => handleInventoryChange(inv.id, 'safeStock', e.target.value)} className="w-20 text-center border-b border-dashed border-gray-400 focus:outline-none focus:border-orange-500 font-semibold text-gray-500 bg-transparent" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="font-semibold text-teal-600">{inv.onOrder}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-700 bg-blue-50/30">{inv.demandInLeadTime.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800 bg-orange-50/30">{inv.daysRemaining === 999 ? '> 365' : inv.daysRemaining} ngày</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-red-600 bg-orange-50/30 text-[15px]">{inv.exhaustionDateStr}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold">
                      {inv.isDanger ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-100 text-red-700"><AlertCircle size={16} /> ĐẶT HÀNG</div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-green-100 text-green-700"><CheckCircle2 size={16} /> AN TOÀN</div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Lịch Tiêu Hao PPG (Calendar Note) --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <CalendarDays size={20} className="text-blue-500" />
              Lịch Theo Dõi Tiêu Hao PPG Hàng Ngày
            </h2>
            <div className="flex items-center gap-4">
              <button onClick={handlePrevMonth} className="p-1.5 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-gray-200 transition-colors"><ChevronLeft size={20} /></button>
              <span className="font-bold text-gray-800 w-[140px] text-center text-lg">Tháng {currentMonthDate.getMonth() + 1} / {currentMonthDate.getFullYear()}</span>
              <button onClick={handleNextMonth} className="p-1.5 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 rounded-lg border border-gray-200 transition-colors"><ChevronRight size={20} /></button>
            </div>
          </div>
          <div className="p-4 bg-gray-50/50">
            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
                <div key={day} className="bg-white py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">{day}</div>
              ))}
              {calendarDays.map((dayInfo, idx) => {
                const dateStr = getLocalYMD(dayInfo.date);
                const isToday = dateStr === getLocalYMD(new Date());
                const isOffDay = isHoliday(dayInfo.date, holidays);
                const isExtraWork = isExplicitWorkDay(dayInfo.date, holidays);
                const usage = masterTimeline[dateStr];
                const dayEvents = orderEventsMap[dateStr] || [];
                
                return (
                  <div key={idx} className={`bg-white min-h-[120px] p-2 flex flex-col transition-colors hover:bg-gray-50 ${!dayInfo.isCurrentMonth ? 'bg-gray-50/50 opacity-50' : ''} ${isToday ? 'ring-2 ring-blue-500 ring-inset' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-500 text-white shadow-md' : isOffDay ? 'text-purple-600 bg-purple-100' : isExtraWork ? 'text-blue-700 bg-blue-100 ring-1 ring-blue-300' : 'text-gray-700'}`}>
                        {dayInfo.date.getDate()}
                      </span>
                      {isOffDay && <CalendarOff size={14} className="text-purple-400 mt-1" title="Ngày nghỉ" />}
                      {isExtraWork && <Sparkles size={14} className="text-blue-400 mt-1" title="Ngày tăng ca" />}
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5 justify-end">
                      {dayEvents.map((evt, eIdx) => (
                        evt.type === 'ORDER' ? (
                          <div key={`evt-${eIdx}`} className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-1 rounded-md font-bold border border-amber-200 flex justify-between items-center shadow-sm" title="Ngày đặt hàng">
                            <span className="flex items-center gap-1"><ShoppingCart size={10}/> Đặt {evt.name}:</span> <span>{evt.qty}</span>
                          </div>
                        ) : (
                          <div key={`evt-${eIdx}`} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-1 rounded-md font-bold border border-emerald-200 flex justify-between items-center shadow-sm" title="Ngày dự kiến hàng về">
                            <span className="flex items-center gap-1"><Package size={10}/> Về {evt.name}:</span> <span>+{evt.qty}</span>
                          </div>
                        )
                      ))}
                      {usage?.['1037'] > 0 && (
                        <div className="text-[11px] bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-semibold border border-blue-100 flex justify-between items-center shadow-sm" title="PPG 1037">
                          <span className="opacity-80">1037:</span> <span>{usage['1037'].toFixed(0)}</span>
                        </div>
                      )}
                      {usage?.['1010'] > 0 && (
                        <div className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-semibold border border-indigo-100 flex justify-between items-center shadow-sm" title="PPG 1010">
                          <span className="opacity-80">1010:</span> <span>{usage['1010'].toFixed(0)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bảng Đặt Hàng (PO) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-teal-700 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><ShoppingCart size={20} className="text-teal-300" /> Bảng Đặt Hàng (PO)</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider text-center">
                  <tr>
                    <th className="px-4 py-3 text-left">Mã NVL</th>
                    <th className="px-4 py-3">Ngày đặt</th>
                    <th className="px-4 py-3">Đang đặt</th>
                    <th className="px-4 py-3">Lead Time</th>
                    <th className="px-4 py-3 bg-teal-50">Dự kiến về</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-sm text-center">
                  {inventory.map((inv) => (
                    <tr key={`order-${inv.id}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-bold text-gray-800 text-left">{inv.name}</td>
                      <td className="px-4 py-3"><input type="date" value={inv.orderDate} onChange={(e) => handleInventoryChange(inv.id, 'orderDate', e.target.value)} className="px-2 py-1 border border-gray-300 rounded focus:ring-teal-500 w-[120px]" /></td>
                      <td className="px-4 py-3"><input type="number" value={inv.onOrder} onChange={(e) => handleInventoryChange(inv.id, 'onOrder', e.target.value)} className="w-20 text-center border-b border-dashed border-teal-400 font-bold text-teal-700 bg-teal-50/50 py-1" /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <input type="number" value={inv.leadTime} onChange={(e) => handleInventoryChange(inv.id, 'leadTime', e.target.value)} className="w-12 text-center border-b border-dashed border-gray-400 focus:outline-none focus:border-teal-500 font-semibold text-gray-700 bg-transparent"/>
                          <span className="text-gray-500 text-xs">ngày</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-bold text-teal-800 bg-teal-50/50">{(inv.orderDate && Number(inv.onOrder) > 0) ? calculateExpectedDate(inv.orderDate, inv.leadTime) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bảng Ngày Nghỉ Lễ / Dừng Máy / Làm Bù */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-purple-700 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><CalendarDays size={20} className="text-purple-300" /> Quản Lý Lịch Đặc Biệt (Nghỉ/Làm bù)</h2>
            </div>
            <div className="p-4 bg-purple-50/50 border-b border-gray-100">
              <form onSubmit={handleAddHoliday} className="flex gap-2">
                <select value={newHoliday.type} onChange={e => setNewHoliday({...newHoliday, type: e.target.value})} className="px-2 py-1.5 border border-gray-300 rounded text-sm bg-white font-semibold">
                  <option value="OFF">Nghỉ Lễ</option>
                  <option value="WORK">Làm bù / Tăng ca</option>
                </select>
                <input required type="date" value={newHoliday.start} onChange={e => setNewHoliday({...newHoliday, start: e.target.value})} className="px-2 py-1.5 border border-gray-300 rounded text-sm w-[115px]" title="Từ ngày"/>
                <input required type="date" value={newHoliday.end} onChange={e => setNewHoliday({...newHoliday, end: e.target.value})} className="px-2 py-1.5 border border-gray-300 rounded text-sm w-[115px]" title="Đến ngày"/>
                <input type="text" placeholder="Lý do..." value={newHoliday.desc} onChange={e => setNewHoliday({...newHoliday, desc: e.target.value})} className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm"/>
                <button type="submit" className="bg-purple-600 text-white px-3 py-1.5 rounded hover:bg-purple-700"><Plus size={18}/></button>
              </form>
            </div>
            <div className="overflow-y-auto max-h-[150px]">
              <table className="min-w-full divide-y divide-gray-200">
                <tbody className="bg-white divide-y divide-gray-200 text-sm">
                  {holidays.length === 0 && (
                    <tr><td colSpan="5" className="text-center py-4 text-gray-400">Chưa có lịch đặc biệt nào được cấu hình.</td></tr>
                  )}
                  {holidays.map(h => (
                    <tr key={h.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-semibold">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold tracking-wide ${h.type === 'WORK' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                          {h.type === 'WORK' ? 'TĂNG CA' : 'NGHỈ LỄ'}
                        </span>
                      </td>
                      <td className="px-3 py-2 font-semibold text-gray-800 w-[90px]">{h.start}</td>
                      <td className="px-1 py-2 text-gray-400 w-[15px]">➔</td>
                      <td className="px-3 py-2 font-semibold text-gray-800 w-[90px]">{h.end}</td>
                      <td className="px-3 py-2 text-gray-600 truncate">{h.desc}</td>
                      <td className="px-3 py-2 text-right">
                        <button onClick={() => handleDeleteHoliday(h.id)} className="text-red-400 hover:text-red-600 p-1"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Bảng Kế hoạch Lot */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><CalendarDays size={20} className="text-blue-500" /> Chi tiết các Lot hàng đang chạy (WIP)</h2>
            <button onClick={() => setIsAddLotModalOpen(true)} className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm"><Plus size={16} /> Thêm Model</button>
          </div>
          <div className="overflow-x-auto max-h-[500px]">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-[11px] font-bold text-gray-600 uppercase tracking-wider text-center sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-2 py-3 border-b border-r border-gray-200 bg-gray-100 w-[40px]">STT</th>
                  <th className="px-2 py-3 text-left border-b border-r border-gray-200 bg-gray-100">Số Lot</th>
                  <th className="px-2 py-3 text-left border-b border-r border-gray-200 bg-gray-100">Model</th>
                  <th className="px-1 py-3 border-b border-r border-gray-200 bg-gray-100">Ngày Input</th>
                  <th className="px-1 py-3 border-b border-r border-gray-200 bg-gray-100">Ngày xuất</th>
                  <th className="px-1 py-3 border-b border-r border-gray-200 bg-gray-100" title="Panel">PNL</th>
                  <th className="px-1 py-3 border-b border-r border-gray-200 bg-gray-100" title="Số tầng STO">STO</th>
                  <th className="px-2 py-3 border-b border-r border-blue-200 bg-blue-50 text-blue-800">Tổng 1037</th>
                  <th className="px-2 py-3 border-b border-r border-indigo-200 bg-indigo-50 text-indigo-800">Tổng 1010</th>
                  <th className="px-2 py-3 border-b border-r border-gray-200 bg-gray-100">Chi tiết</th>
                  <th className="px-2 py-3 border-b border-gray-200 bg-gray-100 text-center">Xóa</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-[11px] text-center">
                {processedLots.map((lot, index) => (
                  <tr key={lot.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 py-1.5 font-bold text-gray-500 border-r border-gray-100 bg-gray-50/50">{index + 1}</td>
                    <td className="px-1 py-1.5 text-left border-r border-gray-100">
                      <input type="text" value={lot.lotNumber} onChange={(e) => handleLotChange(lot.id, 'lotNumber', e.target.value)} className="w-[45px] font-bold text-blue-800 bg-transparent border border-transparent hover:border-gray-300 focus:bg-white focus:border-blue-500 rounded px-1 py-0.5 focus:outline-none" />
                    </td>
                    <td className="px-1 py-1.5 text-left border-r border-gray-100">
                      <input type="text" value={lot.model} onChange={(e) => handleLotChange(lot.id, 'model', e.target.value)} className="w-full min-w-[150px] font-mono font-medium text-gray-700 bg-transparent border border-transparent hover:border-gray-300 focus:bg-white focus:border-blue-500 rounded px-1 py-0.5 focus:outline-none" />
                    </td>
                    <td className="px-1 py-1.5 border-r border-gray-100">
                      <input type="date" value={lot.input ? lot.input.split('/').reverse().join('-') : ''} onChange={(e) => handleLotDateChange(lot.id, 'input', e.target.value)} className="w-[95px] mx-auto bg-transparent text-gray-700 border border-transparent hover:border-gray-300 focus:bg-white focus:border-blue-500 rounded px-1 py-0.5 focus:outline-none" />
                    </td>
                    <td className="px-1 py-1.5 border-r border-gray-100">
                      <input type="date" value={lot.output ? lot.output.split('/').reverse().join('-') : ''} onChange={(e) => handleLotDateChange(lot.id, 'output', e.target.value)} className="w-[95px] mx-auto bg-transparent text-gray-700 border border-transparent hover:border-gray-300 focus:bg-white focus:border-blue-500 rounded px-1 py-0.5 focus:outline-none" />
                    </td>
                    <td className="px-1 py-1.5 bg-gray-50 border-r border-gray-100">
                      <input type="number" value={lot.pnl} onChange={(e) => handleLotChange(lot.id, 'pnl', e.target.value)} className="w-full max-w-[50px] mx-auto text-center font-bold text-gray-800 bg-transparent border border-transparent hover:border-gray-300 focus:bg-white focus:border-blue-500 rounded px-1 py-0.5 focus:outline-none" />
                    </td>
                    <td className="px-1 py-1.5 bg-gray-50 border-r border-gray-200">
                      <input type="number" value={lot.sto} onChange={(e) => handleLotChange(lot.id, 'sto', e.target.value)} className="w-full max-w-[50px] mx-auto text-center text-gray-600 bg-transparent border border-transparent hover:border-gray-300 focus:bg-white focus:border-blue-500 rounded px-1 py-0.5 focus:outline-none" />
                    </td>
                    
                    <td className="px-1 py-1.5 bg-blue-50/40 border-r border-blue-200">
                      <input type="number" value={lot.qty1037} onChange={(e) => handleLotChange(lot.id, 'qty1037', e.target.value)} className="w-full max-w-[55px] mx-auto text-center font-bold text-blue-700 bg-transparent border border-transparent hover:border-blue-300 focus:bg-white focus:border-blue-500 rounded px-1 py-0.5 focus:outline-none" />
                    </td>
                    
                    <td className="px-1 py-1.5 bg-indigo-50/40 border-r border-indigo-200">
                      <input type="number" value={lot.qty1010} onChange={(e) => handleLotChange(lot.id, 'qty1010', e.target.value)} className="w-full max-w-[55px] mx-auto text-center font-bold text-indigo-700 bg-transparent border border-transparent hover:border-indigo-300 focus:bg-white focus:border-indigo-500 rounded px-1 py-0.5 focus:outline-none" />
                    </td>
                    
                    <td className="px-2 py-1.5 text-center border-r border-gray-100">
                      <button onClick={() => setSelectedLotId(lot.id)} className="text-blue-500 hover:text-blue-700 hover:bg-blue-100 p-1.5 rounded transition-colors inline-flex justify-center items-center" title="Xem chi tiết các mốc chạy hàng">
                        <Eye size={16} />
                      </button>
                    </td>
                    <td className="px-2 py-1.5 text-center">
                      <button onClick={() => handleDeleteLot(lot.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors inline-flex justify-center items-center"><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Thêm Lot */}
        {isAddLotModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
              <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
                <h3 className="font-bold flex items-center gap-2"><Plus size={18} /> Thêm Model Sản Xuất Mới</h3>
                <button onClick={() => setIsAddLotModalOpen(false)} className="hover:bg-blue-500 p-1 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddLot} className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số Lot</label>
                    <input required type="text" value={newLot.lotNumber} onChange={e => setNewLot({...newLot, lotNumber: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="VD: L-08" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mã Model</label>
                    <input required type="text" value={newLot.model} onChange={e => setNewLot({...newLot, model: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="VD: STO-0923..." />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Input</label>
                    <input required type="date" value={newLot.input} onChange={e => setNewLot({...newLot, input: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày Xuất</label>
                    <input required type="date" value={newLot.output} onChange={e => setNewLot({...newLot, output: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PNL</label>
                    <input required type="number" min="1" value={newLot.pnl || ''} onChange={e => setNewLot({...newLot, pnl: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Bắt buộc" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IVH Layer</label>
                    <input type="number" min="0" value={newLot.ivh || ''} onChange={e => setNewLot({...newLot, ivh: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">STO Layer</label>
                    <input type="number" min="0" value={newLot.sto || ''} onChange={e => setNewLot({...newLot, sto: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tổng PPG 1037 (ea)</label>
                    <input required type="number" min="0" value={newLot.qty1037} onChange={e => setNewLot({...newLot, qty1037: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tổng PPG 1010 (ea)</label>
                    <input required type="number" min="0" value={newLot.qty1010} onChange={e => setNewLot({...newLot, qty1010: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                  <button type="button" onClick={() => setIsAddLotModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">Hủy</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Lưu Model</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}