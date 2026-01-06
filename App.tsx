
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Role, User, Table, TableStatus, Order, OrderStatus, OrderType, 
  MenuItem, Category, OrderItem, Modifier, AuditLog, PaymentMethod
} from './types';
import { INITIAL_TABLES, MENU_ITEMS as INITIAL_MENU_ITEMS, CATEGORIES, TAX_RATE, SERVICE_CHARGE_RATE, MOCK_USERS } from './constants';
import { 
  LayoutDashboard, 
  Utensils, 
  ChefHat, 
  Settings, 
  LogOut, 
  ShoppingCart, 
  Users, 
  FileText,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  Search,
  Percent,
  Banknote,
  Tag,
  ChevronRight,
  Package,
  PlusCircle,
  Image as ImageIcon,
  Printer,
  X,
  Check,
  Lock,
  ShieldCheck,
  History,
  Fingerprint,
  FileSearch,
  Copy,
  Delete,
  Clock,
  Flame,
  Wine,
  IceCream,
  Timer,
  Upload,
  CreditCard,
  Globe,
  Loader2,
  PlusSquare,
  Eye,
  EyeOff,
  Ticket,
  Edit2
} from 'lucide-react';
import { getBusinessInsights } from './services/geminiService';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';

// --- Shared Components ---

const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}> = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const base = "px-4 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
    danger: "bg-rose-500 text-white hover:bg-rose-600",
    success: "bg-emerald-500 text-white hover:bg-emerald-600",
    ghost: "bg-transparent text-slate-500 hover:bg-slate-100",
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`} disabled={disabled}>
      {children}
    </button>
  );
};

// --- Payment Modal Component ---

const PaymentModal: React.FC<{
  order: Order;
  onPaymentComplete: (method: PaymentMethod) => void;
  onCancel: () => void;
}> = ({ order, onPaymentComplete, onCancel }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const handleProcessPayment = (method: PaymentMethod) => {
    setSelectedMethod(method);
    if (method === 'ONLINE') {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onPaymentComplete(method);
      }, 2500);
    } else {
      onPaymentComplete(method);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-4">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-md overflow-hidden p-8 animate-in zoom-in duration-300">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select Payment Method</h2>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mt-1">Order Total: ${order.total.toFixed(2)}</p>
        </div>

        {isProcessing ? (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-16 h-16 text-indigo-600 animate-spin mb-6" />
            <p className="font-black text-slate-800 uppercase tracking-widest">Processing Online Payment...</p>
            <p className="text-slate-400 text-xs mt-2 italic">Connecting to ITZENBD secure gateway</p>
          </div>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={() => handleProcessPayment('CASH')}
              className="w-full flex items-center justify-between p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-indigo-600">
                  <Banknote size={24} />
                </div>
                <div className="text-left">
                  <span className="block font-black text-slate-900 uppercase text-xs tracking-widest">Cash Settlement</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Immediate Physical Payment</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </button>

            <button 
              onClick={() => handleProcessPayment('CARD')}
              className="w-full flex items-center justify-between p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50/50 transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-indigo-600">
                  <CreditCard size={24} />
                </div>
                <div className="text-left">
                  <span className="block font-black text-slate-900 uppercase text-xs tracking-widest">Card Terminal</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">External POS Integration</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-slate-300" />
            </button>

            <button 
              onClick={() => handleProcessPayment('ONLINE')}
              className="w-full flex items-center justify-between p-6 bg-indigo-600 rounded-3xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shadow-sm text-white">
                  <Globe size={24} />
                </div>
                <div className="text-left">
                  <span className="block font-black text-white uppercase text-xs tracking-widest">Online Gateway</span>
                  <span className="text-[10px] text-indigo-200 font-bold uppercase">Digital Wallet & API</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-indigo-400" />
            </button>

            <Button variant="ghost" className="w-full mt-6 text-slate-400 font-black uppercase text-[10px] tracking-widest" onClick={onCancel}>
              Cancel Transaction
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Order Item Detail Modal ---

const OrderItemDetailModal: React.FC<{
  item: OrderItem;
  menuItem?: MenuItem;
  onClose: () => void;
  onToggleModifier: (mod: Modifier) => void;
  onAddCustomModifier: (name: string, price: number) => void;
  onRemoveModifier: (id: string) => void;
  onApplyDiscount: (value: number, type: 'percentage' | 'fixed') => void;
  isPaid: boolean;
}> = ({ item, menuItem, onClose, onToggleModifier, onAddCustomModifier, onRemoveModifier, onApplyDiscount, isPaid }) => {
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("0");
  const [discVal, setDiscVal] = useState(String(item.discountValue || 0));
  const [discType, setDiscType] = useState<'percentage' | 'fixed'>(item.discountType || 'percentage');

  const handleAddCustom = () => {
    if (!customName.trim()) return;
    onAddCustomModifier(customName, parseFloat(customPrice) || 0);
    setCustomName("");
    setCustomPrice("0");
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
        <div className="p-8 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
          <div>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1 block">{item.prepArea} Station</span>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">{item.name}</h2>
            <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-wider">Base Price: ${item.unitPrice.toFixed(2)}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white hover:bg-slate-100 rounded-2xl shadow-sm text-slate-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          {/* Predefined Modifiers */}
          {menuItem?.modifiers && menuItem.modifiers.length > 0 && (
            <section>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Standard Modifiers</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {menuItem.modifiers.map(mod => {
                  const isSelected = item.modifiers.some(m => m.id === mod.id);
                  return (
                    <button
                      key={mod.id}
                      disabled={isPaid}
                      onClick={() => onToggleModifier(mod)}
                      className={`p-4 rounded-3xl text-xs font-black transition-all border text-left flex flex-col gap-1 ${
                        isSelected 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl scale-105' 
                          : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-400'
                      }`}
                    >
                      <span>{mod.name}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>+${mod.price.toFixed(2)}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {/* Applied Modifiers & Custom Adder */}
          <section>
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Custom Modifiers</h3>
             <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {item.modifiers.filter(m => !menuItem?.modifiers.some(pm => pm.id === m.id)).map(mod => (
                    <span key={mod.id} className="px-4 py-2 bg-rose-50 text-rose-600 text-xs font-black rounded-2xl border border-rose-100 flex items-center gap-2">
                      {mod.name} (+$${mod.price})
                      {!isPaid && <button onClick={() => onRemoveModifier(mod.id)} className="hover:text-rose-800"><X size={14}/></button>}
                    </span>
                  ))}
                </div>
                
                {!isPaid && (
                  <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                    <input 
                      placeholder="Modifier Name"
                      className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                    />
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2">
                      <span className="text-xs font-bold text-slate-400 mr-2">$</span>
                      <input 
                        type="number"
                        placeholder="0"
                        className="w-12 text-xs font-black outline-none"
                        value={customPrice}
                        onChange={(e) => setCustomPrice(e.target.value)}
                      />
                    </div>
                    <Button onClick={handleAddCustom} disabled={!customName.trim()} className="rounded-xl p-2 h-10 w-10">
                      <Plus size={20} />
                    </Button>
                  </div>
                )}
             </div>
          </section>

          {/* Item Discount */}
          <section>
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Item Level Discount</h3>
             <div className="flex items-center gap-3">
                <div className="flex-1 flex bg-slate-50 border border-slate-100 rounded-3xl p-2">
                   <input 
                     type="number"
                     placeholder="Value"
                     className="bg-transparent flex-1 px-4 py-2 text-sm font-black outline-none"
                     value={discVal}
                     onChange={(e) => setDiscVal(e.target.value)}
                     disabled={isPaid}
                   />
                   <div className="flex bg-white rounded-2xl p-1 shadow-sm">
                      <button 
                        onClick={() => setDiscType('percentage')}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${discType === 'percentage' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}
                      >
                        %
                      </button>
                      <button 
                        onClick={() => setDiscType('fixed')}
                        className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${discType === 'fixed' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400'}`}
                      >
                        $
                      </button>
                   </div>
                </div>
                <Button 
                  onClick={() => onApplyDiscount(parseFloat(discVal) || 0, discType)} 
                  variant="success" 
                  className="px-8 py-4 rounded-3xl"
                  disabled={isPaid}
                >
                  Apply
                </Button>
             </div>
          </section>
        </div>

        <div className="p-8 bg-slate-900 text-white rounded-t-[40px] flex justify-between items-center shadow-2xl">
          <div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Final Line Total</span>
            <p className="text-3xl font-black tracking-tighter">
              ${((item.unitPrice * item.quantity) - (item.discountType === 'percentage' ? (item.unitPrice * item.quantity * ((item.discountValue || 0)/100)) : (item.discountValue || 0))).toFixed(2)}
            </p>
          </div>
          <Button onClick={onClose} className="bg-indigo-500 hover:bg-indigo-600 text-white px-10 py-5 rounded-[24px] font-black shadow-xl shadow-indigo-500/20">
            Confirm & Update
          </Button>
        </div>
      </div>
    </div>
  );
};

// --- Authentication View ---

const LoginView: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleClear = () => setPin('');
  const handleBackspace = () => setPin(prev => prev.slice(0, -1));

  useEffect(() => {
    if (pin.length === 4) {
      const user = MOCK_USERS.find(u => u.pin === pin);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid PIN. Please try again.');
        setTimeout(() => setPin(''), 500);
      }
    }
  }, [pin, onLogin]);

  return (
    <div className="h-full w-full bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-10 duration-700">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl mx-auto flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-indigo-500/20 mb-6">Z</div>
          <h1 className="text-3xl font-black text-white tracking-tight">ITZENBD POS</h1>
          <p className="text-slate-500 mt-2 font-medium">Secure Terminal Access</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[40px] p-10 shadow-3xl">
          <div className="flex justify-center gap-4 mb-10">
            {[0, 1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-full transition-all duration-300 ${pin.length > i ? 'bg-indigo-500 scale-125 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-700'}`} 
              />
            ))}
          </div>

          {error && <p className="text-rose-500 text-center text-sm font-bold mb-6 animate-pulse">{error}</p>}

          <div className="grid grid-cols-3 gap-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button 
                key={num} 
                onClick={() => handleKeyPress(num)}
                className="h-20 rounded-3xl bg-white/5 hover:bg-white/10 active:bg-indigo-600 text-white text-2xl font-bold transition-all active:scale-95 border border-white/5"
              >
                {num}
              </button>
            ))}
            <button onClick={handleClear} className="h-20 rounded-3xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 text-xl font-bold border border-rose-500/10">CLR</button>
            <button onClick={() => handleKeyPress('0')} className="h-20 rounded-3xl bg-white/5 hover:bg-white/10 text-white text-2xl font-bold border border-white/5">0</button>
            <button onClick={handleBackspace} className="h-20 rounded-3xl bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/5"><Delete /></button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-slate-600 text-xs font-bold uppercase tracking-widest">Authorized Personnel Only</p>
          <div className="mt-4 flex justify-center gap-6 text-[10px] text-slate-700 font-bold uppercase">
             <span>v2.4.0 Stable</span>
             <span>System Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Security Modals ---

const ManagerOverrideModal: React.FC<{ onApprove: () => void; onCancel: () => void; action: string }> = ({ onApprove, onCancel, action }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const manager = MOCK_USERS.find(u => u.pin === pin && (u.role === 'ADMIN' || u.role === 'MANAGER'));
    if (manager) {
      onApprove();
    } else {
      setError('Invalid Manager PIN');
      setPin('');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-sm overflow-hidden p-8 flex flex-col items-center text-center animate-in zoom-in duration-200">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
          <ShieldCheck size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Manager PIN Required</h3>
        <p className="text-slate-500 text-sm mb-6">
          Action: <span className="font-bold text-slate-800 italic">{action}</span>
        </p>
        
        <input 
          type="password" 
          maxLength={4}
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setError('');
          }}
          placeholder="Enter 4-digit PIN"
          className="w-full text-center text-2xl tracking-[1em] font-black bg-slate-50 border border-slate-200 rounded-xl py-4 mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {error && <p className="text-rose-500 text-xs font-bold mb-4">{error}</p>}

        <div className="w-full space-y-3">
          <Button className="w-full py-4 text-lg" onClick={handleSubmit} disabled={pin.length !== 4}>Authorize</Button>
          <Button variant="ghost" className="w-full" onClick={onCancel}>Cancel Action</Button>
        </div>
      </div>
    </div>
  );
};

// --- Receipt Component ---

const ReceiptModal: React.FC<{ order: Order; onClose: () => void; tableNumber?: number; onPrint: () => void }> = ({ order, onClose, tableNumber, onPrint }) => {
  const isReprint = order.reprintCount > 0;

  const handlePrintAction = () => {
    onPrint();
    window.print();
  };

  const calculatedDiscountValue = order.discountType === 'percentage' 
    ? order.subtotal * (order.discountValue / 100)
    : order.discountValue;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in fade-in zoom-in duration-300 relative overflow-hidden">
        {isReprint && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 pointer-events-none opacity-[0.05] whitespace-nowrap z-0">
            <span className="text-9xl font-black uppercase">DUPLICATE</span>
          </div>
        )}

        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl z-10 relative">
          <div className="flex items-center gap-2 text-emerald-600 font-bold">
            <FileSearch size={20} />
            <span>{isReprint ? 'Duplicate Receipt' : 'Original Receipt'}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div id="receipt-content" className="p-8 font-mono text-sm text-slate-800 printable-receipt bg-white z-10 relative">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black tracking-tighter mb-1 uppercase">ITZENBD Kitchen</h2>
            <p className="text-xs text-slate-500 uppercase">123 Culinary Blvd, Food City</p>
            <p className="text-xs text-slate-500">VAT ID: 987654321</p>
          </div>

          {isReprint && (
            <div className="border-2 border-slate-800 p-1 text-center font-black text-lg mb-4 uppercase">
              *** Duplicate Copy ***
            </div>
          )}

          <div className="border-t border-dashed border-slate-300 py-3 flex justify-between text-xs">
            <span>Date: {new Date(order.paidAt || Date.now()).toLocaleDateString()}</span>
            <span>Time: {new Date(order.paidAt || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>

          <div className="border-b border-dashed border-slate-300 pb-3 mb-4 text-xs">
            <div className="flex justify-between">
              <span className="font-bold">Receipt #: {order.receiptNumber}</span>
              <span>{order.type}</span>
            </div>
            <div className="flex justify-between">
               <span>Order Ref: {order.orderNumber}</span>
               {tableNumber && <span>Table: {tableNumber}</span>}
            </div>
            <div>Cashier: Active Staff</div>
            {order.paymentMethod && <div>Payment: {order.paymentMethod}</div>}
          </div>

          <div className="space-y-2 mb-6">
            {order.items.map(item => (
              <div key={item.id}>
                <div className="flex justify-between">
                  <span className="flex-1">{item.quantity}x {item.name}</span>
                  <span className="ml-4">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
                {item.modifiers.map(m => (
                  <div key={m.id} className="text-[10px] text-slate-500 pl-4 italic">
                    + {m.name}
                  </div>
                ))}
                {(item.discountValue || 0) > 0 && (
                  <div className="text-[10px] text-rose-500 pl-4">
                    - Item Disc: {item.discountType === 'percentage' ? `${item.discountValue}%` : `$${item.discountValue}`}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-slate-300 pt-4 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {calculatedDiscountValue > 0 && (
              <div className="flex justify-between text-rose-500">
                <span>Discount</span>
                <span>-${calculatedDiscountValue.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>${order.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service (5%)</span>
              <span>${order.serviceCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-black text-lg pt-3 mt-2 border-t border-slate-300">
              <span>TOTAL</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-10 text-center text-[10px] text-slate-400 uppercase tracking-widest">
            <div className="mb-2">*** Thank You! ***</div>
            <div>Reference: {order.id.split('-')[0]}</div>
            {isReprint && <div>Printed: {new Date().toLocaleString()}</div>}
          </div>
        </div>

        <div className="p-6 bg-slate-50 rounded-b-2xl border-t border-slate-100 flex gap-3 z-10 relative">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" className="flex-1" onClick={handlePrintAction}>
            <Printer size={18} />
            {isReprint ? 'Reprint Copy' : 'Print Original'}
          </Button>
        </div>
      </div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #receipt-content, #receipt-content * { visibility: visible; }
          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'POS' | 'TABLES' | 'KDS' | 'REPORTS' | 'SPECS' | 'INVENTORY'>('POS');
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [orders, setOrders] = useState<Order[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [receiptSequence, setReceiptSequence] = useState(1);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Partial<Order> | null>(null);
  const [aiInsight, setAiInsight] = useState<string>("Analyzing recent data...");
  const [searchQuery, setSearchQuery] = useState("");
  const [showReceipt, setShowReceipt] = useState<Order | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState<Order | null>(null);
  const [pendingOverride, setPendingOverride] = useState<{ action: string; execute: () => void } | null>(null);
  const [selectedKdsStation, setSelectedKdsStation] = useState<string>('All');
  const [editingOrderItemId, setEditingOrderItemId] = useState<string | null>(null);

  // Update Insights
  useEffect(() => {
    if (activeTab === 'REPORTS' && orders.length > 0) {
      getBusinessInsights(orders).then(setAiInsight);
    }
  }, [orders, activeTab]);

  // Derived Data
  const filteredMenuItems = useMemo(() => {
    return menuItems.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      CATEGORIES.find(c => c.id === item.categoryId)?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, menuItems]);

  const activeOrders = orders.filter(o => o.status !== OrderStatus.PAID && o.status !== OrderStatus.VOID);

  // Helper for Order Calculations
  const calculateTotals = (items: OrderItem[], discountValue: number = 0, discountType: 'percentage' | 'fixed' = 'percentage') => {
    const subtotal = items.reduce((sum, i) => {
      const baseItemTotal = i.unitPrice * i.quantity;
      const itemDisc = i.discountType === 'percentage' 
        ? baseItemTotal * ((i.discountValue || 0) / 100)
        : Math.min(baseItemTotal, i.discountValue || 0);
      return sum + (baseItemTotal - itemDisc);
    }, 0);

    const calculatedDiscount = discountType === 'percentage' 
      ? subtotal * (discountValue / 100) 
      : Math.min(discountValue, subtotal);
    
    const discountedSubtotal = Math.max(0, subtotal - calculatedDiscount);
    const tax = discountedSubtotal * TAX_RATE;
    const serviceCharge = discountedSubtotal * SERVICE_CHARGE_RATE;
    const total = discountedSubtotal + tax + serviceCharge;

    return { subtotal, discountValue, discountType, tax, serviceCharge, total };
  };

  // Log Audit
  const logAction = (action: string, details: string, severity: 'low' | 'medium' | 'high' = 'low') => {
    if (!currentUser) return;
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      timestamp: Date.now(),
      userId: currentUser.id,
      userName: currentUser.name,
      action,
      details,
      severity
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Security Wrapper
  const requestPermission = (action: string, callback: () => void, requiresManager: boolean = true) => {
    if (!currentUser) return;
    if (currentUser.role === 'ADMIN' || currentUser.role === 'MANAGER') {
      callback();
    } else if (requiresManager) {
      setPendingOverride({ action, execute: () => {
        logAction('MANAGER_OVERRIDE', `Override granted for ${action} by Manager Approval`, 'high');
        callback();
        setPendingOverride(null);
      }});
    } else {
      logAction('PERMISSION_DENIED', `Action ${action} denied for ${currentUser.role}`, 'medium');
      alert("Permission Denied: Unauthorized access to " + action);
    }
  };

  // Handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    logAction('STAFF_LOGIN', `Staff member ${user.name} logged in`, 'low');
    if (user.role === 'KITCHEN') {
      setActiveTab('KDS');
    } else {
      setActiveTab('POS');
    }
  };

  const handleLogout = () => {
    if (currentUser) logAction('STAFF_LOGOUT', `Staff member ${currentUser.name} logged out`, 'low');
    setCurrentUser(null);
    setCurrentOrder(null);
    setSelectedTable(null);
  };

  const handleSelectTable = (table: Table) => {
    if (!currentUser || currentUser.role === 'KITCHEN') return;
    setSelectedTable(table);
    const existingOrder = orders.find(o => o.tableId === table.id && o.status !== OrderStatus.PAID && o.status !== OrderStatus.VOID);
    if (existingOrder) {
      setCurrentOrder(existingOrder);
    } else {
      setCurrentOrder({
        tableId: table.id,
        orderNumber: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        status: OrderStatus.DRAFT,
        type: OrderType.DINE_IN,
        items: [],
        subtotal: 0,
        discountValue: 0,
        discountType: 'percentage',
        tax: 0,
        serviceCharge: 0,
        total: 0,
        reprintCount: 0,
        createdAt: Date.now()
      });
    }
    setActiveTab('POS');
  };

  const addItemToOrder = (item: MenuItem) => {
    if (!currentOrder || currentOrder.status === OrderStatus.PAID || !item.isAvailable) return;
    const items = [...(currentOrder.items || [])];
    const existingIndex = items.findIndex(i => i.menuItemId === item.id && i.modifiers.length === 0 && !i.discountValue);
    
    if (existingIndex > -1) {
      items[existingIndex].quantity += 1;
    } else {
      items.push({
        id: `oi-${Date.now()}-${Math.random()}`,
        menuItemId: item.id,
        name: item.name,
        quantity: 1,
        unitPrice: item.basePrice,
        modifiers: [],
        status: 'PENDING',
        prepArea: item.prepArea,
        discountValue: 0,
        discountType: 'percentage'
      });
    }

    const totals = calculateTotals(items, currentOrder.discountValue, currentOrder.discountType);
    setCurrentOrder({ ...currentOrder, items, ...totals });
  };

  const toggleModifier = (orderItemId: string, modifier: Modifier) => {
    if (!currentOrder || !currentOrder.items || currentOrder.status === OrderStatus.PAID) return;
    
    const items = currentOrder.items.map(i => {
      if (i.id === orderItemId) {
        const hasModifier = i.modifiers.some(m => m.id === modifier.id);
        const newModifiers = hasModifier 
          ? i.modifiers.filter(m => m.id !== modifier.id)
          : [...i.modifiers, modifier];
        
        const menuItem = menuItems.find(mi => mi.id === i.menuItemId);
        const basePrice = menuItem?.basePrice || i.unitPrice; 
        const newUnitPrice = basePrice + newModifiers.reduce((sum, m) => sum + m.price, 0);

        return { ...i, modifiers: newModifiers, unitPrice: newUnitPrice };
      }
      return i;
    });

    const totals = calculateTotals(items, currentOrder.discountValue || 0, currentOrder.discountType || 'percentage');
    setCurrentOrder({ ...currentOrder, items, ...totals });
    
    if (currentOrder.id && currentOrder.status !== OrderStatus.DRAFT) {
       setOrders(prev => prev.map(o => o.id === currentOrder.id ? { ...o, items, ...totals } : o));
    }
  };

  const addCustomModifier = (orderItemId: string, name: string, price: number) => {
    if (!currentOrder || !currentOrder.items || currentOrder.status === OrderStatus.PAID) return;

    const newMod: Modifier = {
      id: `custom-${Date.now()}`,
      name: name,
      price: price
    };

    const items = currentOrder.items.map(i => {
      if (i.id === orderItemId) {
        const newModifiers = [...i.modifiers, newMod];
        const newUnitPrice = i.unitPrice + price;
        return { ...i, modifiers: newModifiers, unitPrice: newUnitPrice };
      }
      return i;
    });

    const totals = calculateTotals(items, currentOrder.discountValue || 0, currentOrder.discountType || 'percentage');
    setCurrentOrder({ ...currentOrder, items, ...totals });
    
    if (currentOrder.id && currentOrder.status !== OrderStatus.DRAFT) {
      setOrders(prev => prev.map(o => o.id === currentOrder.id ? { ...o, items, ...totals } : o));
    }
  };

  const removeModifier = (orderItemId: string, modId: string) => {
    if (!currentOrder || !currentOrder.items || currentOrder.status === OrderStatus.PAID) return;

    const items = currentOrder.items.map(i => {
      if (i.id === orderItemId) {
        const modToRemove = i.modifiers.find(m => m.id === modId);
        if (!modToRemove) return i;
        const newModifiers = i.modifiers.filter(m => m.id !== modId);
        const newUnitPrice = i.unitPrice - modToRemove.price;
        return { ...i, modifiers: newModifiers, unitPrice: newUnitPrice };
      }
      return i;
    });

    const totals = calculateTotals(items, currentOrder.discountValue || 0, currentOrder.discountType || 'percentage');
    setCurrentOrder({ ...currentOrder, items, ...totals });
    
    if (currentOrder.id && currentOrder.status !== OrderStatus.DRAFT) {
      setOrders(prev => prev.map(o => o.id === currentOrder.id ? { ...o, items, ...totals } : o));
    }
  };

  const applyItemDiscount = (orderItemId: string, value: number, type: 'percentage' | 'fixed') => {
    if (!currentOrder || !currentOrder.items || currentOrder.status === OrderStatus.PAID) return;

    const items = currentOrder.items.map(i => {
      if (i.id === orderItemId) {
        return { ...i, discountValue: value, discountType: type };
      }
      return i;
    });

    const totals = calculateTotals(items, currentOrder.discountValue || 0, currentOrder.discountType || 'percentage');
    setCurrentOrder({ ...currentOrder, items, ...totals });

    if (currentOrder.id && currentOrder.status !== OrderStatus.DRAFT) {
      setOrders(prev => prev.map(o => o.id === currentOrder.id ? { ...o, items, ...totals } : o));
    }
  };

  const updateItemQuantity = (itemId: string, delta: number) => {
    if (!currentOrder || !currentOrder.items || currentOrder.status === OrderStatus.PAID) return;

    if (delta < 0) {
      const orderInKitchen = currentOrder.status !== OrderStatus.DRAFT;
      if (orderInKitchen) {
        requestPermission('REDUCE_SENT_ITEM', () => {
          performUpdate(itemId, delta);
        });
        return;
      }
    }

    performUpdate(itemId, delta);

    function performUpdate(id: string, d: number) {
      const items = (currentOrder!.items || []).map(i => {
        if (i.id === id) {
          const newQty = Math.max(0, i.quantity + d);
          return { ...i, quantity: newQty };
        }
        return i;
      }).filter(i => i.quantity > 0);

      const totals = calculateTotals(items, currentOrder!.discountValue || 0, currentOrder!.discountType || 'percentage');
      setCurrentOrder({ ...currentOrder, items, ...totals });
      
      if (currentOrder!.id && currentOrder!.status !== OrderStatus.DRAFT) {
        setOrders(prev => prev.map(o => o.id === currentOrder!.id ? { ...o, items, ...totals } : o));
      }
    }
  };

  const submitOrder = () => {
    if (!currentOrder || !currentOrder.items?.length) return;
    
    const newOrder: Order = {
      ...currentOrder as Order,
      status: OrderStatus.PENDING,
      reprintCount: 0,
      items: (currentOrder.items || []).map(i => ({ ...i, status: 'PENDING' }))
    };

    setOrders(prev => {
      const idx = prev.findIndex(o => o.id === newOrder.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = newOrder;
        return updated;
      }
      return [...prev, { ...newOrder, id: `ord-${Date.now()}` }];
    });

    if (newOrder.tableId) {
      setTables(prev => prev.map(t => t.id === newOrder.tableId ? { ...t, status: TableStatus.OCCUPIED } : t));
    }

    logAction('SUBMIT_ORDER', `Order ${newOrder.orderNumber} sent to kitchen`, 'low');
    setCurrentOrder(null);
    setSelectedTable(null);
    setActiveTab('TABLES');
  };

  const completePayment = (method: PaymentMethod) => {
    if (!showPaymentModal || !showPaymentModal.id) return;
    
    const paidAt = Date.now();
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const receiptNum = `RCPT-${dateStr}-${String(receiptSequence).padStart(4, '0')}`;
    
    let paidOrderRecord: Order | null = null;

    setOrders(prev => prev.map(o => {
      if (o.id === showPaymentModal.id) {
        const updatedOrder: Order = { 
          ...o, 
          status: OrderStatus.PAID, 
          paidAt, 
          receiptNumber: receiptNum,
          reprintCount: 0,
          paymentMethod: method
        };
        paidOrderRecord = updatedOrder;
        return updatedOrder;
      }
      return o;
    }));

    if (showPaymentModal.tableId) {
      setTables(prev => prev.map(t => t.id === showPaymentModal.tableId ? { ...t, status: TableStatus.AVAILABLE } : t));
    }

    setReceiptSequence(prev => prev + 1);

    if (paidOrderRecord) {
      setShowReceipt(paidOrderRecord);
      logAction('PAYMENT_COLLECTED', `Payment (${method}) for ${paidOrderRecord.orderNumber} finalized. Receipt: ${receiptNum}. Bill Locked.`, 'medium');
    }
    
    setShowPaymentModal(null);
    setCurrentOrder(null);
    setSelectedTable(null);
    setActiveTab('TABLES');
  };

  const handleReprintLog = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const newCount = o.reprintCount + 1;
        logAction('RECEIPT_REPRINTED', `Receipt ${o.receiptNumber} reprinted (Copy #${newCount})`, 'medium');
        return { ...o, reprintCount: newCount };
      }
      return o;
    }));
  };

  const handleSaveMenuItem = (itemData: Omit<MenuItem, 'id' | 'isAvailable'>, id?: string) => {
    requestPermission(id ? 'EDIT_MENU_ITEM' : 'ADD_MENU_ITEM', () => {
      if (id) {
        setMenuItems(prev => prev.map(mi => mi.id === id ? { ...mi, ...itemData } : mi));
        logAction('MENU_MODIFIED', `Item "${itemData.name}" updated in menu`, 'medium');
      } else {
        const newItem: MenuItem = { ...itemData, id: `m-${Date.now()}`, isAvailable: true };
        setMenuItems(prev => [...prev, newItem]);
        logAction('MENU_MODIFIED', `New item "${itemData.name}" added to menu`, 'medium');
      }
    }, true);
  };

  const toggleItemAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStatus = !item.isAvailable;
        logAction('STOCK_UPDATE', `Item "${item.name}" marked as ${newStatus ? 'Available' : 'Out of Stock'}`, 'medium');
        return { ...item, isAvailable: newStatus };
      }
      return item;
    }));
  };

  // --- Views ---

  const ReportsView = () => {
    const revenueData = useMemo(() => {
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      return last7Days.map(date => {
        const dayOrders = orders.filter(o => o.status === OrderStatus.PAID && new Date(o.paidAt || 0).toISOString().split('T')[0] === date);
        return {
          name: date.split('-').slice(1).join('/'),
          revenue: dayOrders.reduce((sum, o) => sum + o.total, 0)
        };
      });
    }, [orders]);

    const categoryData = useMemo(() => {
      const stats: Record<string, number> = {};
      orders.filter(o => o.status === OrderStatus.PAID).forEach(o => {
        o.items.forEach(i => {
          const item = menuItems.find(mi => mi.id === i.menuItemId);
          const catName = CATEGORIES.find(c => c.id === item?.categoryId)?.name || 'Unknown';
          stats[catName] = (stats[catName] || 0) + i.quantity;
        });
      });
      return Object.entries(stats).map(([name, value]) => ({ name, value }));
    }, [orders, menuItems]);

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <h3 className="text-xl font-black mb-6 text-slate-800 flex items-center gap-2">
                 <Sparkles className="text-indigo-500" /> AI Business Consultant
              </h3>
              <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50">
                 <p className="text-indigo-900 font-medium leading-relaxed italic">"{aiInsight}"</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
              <h3 className="text-xl font-black mb-6 text-slate-800">Revenue Performance</h3>
              <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                      <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Bar dataKey="revenue" fill="#6366f1" radius={[8, 8, 0, 0]} />
                    </BarChart>
                 </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
               <h3 className="text-xl font-black mb-4 text-slate-800">Product Mix</h3>
               <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {categoryData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                       </Pie>
                       <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                    </PieChart>
                 </ResponsiveContainer>
               </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[40px] shadow-xl text-white flex flex-col">
               <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400" /> Security Audit
               </h3>
               <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar flex-1">
                  {auditLogs.map(log => (
                     <div key={log.id} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="flex justify-between items-start mb-1">
                           <span className={`text-[10px] font-black uppercase tracking-widest ${log.severity === 'high' ? 'text-rose-400' : 'text-indigo-400'}`}>{log.action}</span>
                           <span className="text-[10px] text-slate-500">{new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium">{log.details}</p>
                        <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase">User: {log.userName}</p>
                     </div>
                  ))}
               </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InventoryView = () => {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [newItem, setNewItem] = useState<Omit<MenuItem, 'id' | 'isAvailable'>>({
      name: '',
      description: '',
      basePrice: 0,
      categoryId: '1',
      modifiers: [],
      imageUrl: '',
      prepArea: 'Hot'
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        setError("File is too large. Maximum size is 2MB.");
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError("Unsupported format. Please upload JPG or PNG.");
        return;
      }
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewItem(prev => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    };

    const resetForm = () => {
      setNewItem({
        name: '',
        description: '',
        basePrice: 0,
        categoryId: '1',
        modifiers: [],
        imageUrl: '',
        prepArea: 'Hot'
      });
      setEditingId(null);
      setError(null);
      setShowForm(false);
    };

    const startEdit = (item: MenuItem) => {
      setNewItem({
        name: item.name,
        description: item.description,
        basePrice: item.basePrice,
        categoryId: item.categoryId,
        modifiers: item.modifiers,
        imageUrl: item.imageUrl,
        prepArea: item.prepArea
      });
      setEditingId(item.id);
      setShowForm(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Menu Management</h2>
           <Button onClick={() => { resetForm(); setShowForm(true); }} className="px-6 py-3 rounded-2xl shadow-lg shadow-indigo-500/20">
              <PlusCircle size={20} /> Add New Item
           </Button>
        </div>

        {showForm && (
           <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 animate-in slide-in-from-top-4 duration-300">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-black text-xl text-slate-800">{editingId ? 'Edit Product' : 'Configure New Product'}</h3>
                 <button onClick={resetForm} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Product Image (JPG/PNG, max 2MB)</label>
                    <div 
                       onClick={() => fileInputRef.current?.click()}
                       className="aspect-square w-full rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all overflow-hidden relative group"
                    >
                       {newItem.imageUrl ? (
                          <>
                             <img src={newItem.imageUrl} className="w-full h-full object-cover" alt="Preview" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black text-xs uppercase tracking-widest">
                                <Upload size={20} className="mr-2" /> Change Image
                             </div>
                          </>
                       ) : (
                          <>
                             <ImageIcon size={32} className="text-slate-300 mb-2" />
                             <span className="text-xs font-bold text-slate-400">Click to upload</span>
                          </>
                       )}
                       <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept=".jpg,.jpeg,.png"
                          onChange={handleFileSelect} 
                       />
                    </div>
                    {error && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{error}</p>}
                 </div>

                 <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Item Name</label>
                       <input 
                          placeholder="e.g. Classic Margherita"
                          className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500" 
                          value={newItem.name}
                          onChange={e => setNewItem({...newItem, name: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                       <select 
                          className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                          value={newItem.categoryId}
                          onChange={e => setNewItem({...newItem, categoryId: e.target.value})}
                       >
                          {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Base Price ($)</label>
                       <input 
                          type="number"
                          placeholder="0.00"
                          className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500" 
                          value={newItem.basePrice || ''}
                          onChange={e => setNewItem({...newItem, basePrice: parseFloat(e.target.value) || 0})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Preparation Area</label>
                       <select 
                          className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500"
                          value={newItem.prepArea}
                          onChange={e => setNewItem({...newItem, prepArea: e.target.value as any})}
                       >
                          <option value="Hot">Hot Kitchen</option>
                          <option value="Cold">Cold / Salad</option>
                          <option value="Bar">Bar / Drinks</option>
                          <option value="Bakery">Bakery / Desserts</option>
                       </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                       <textarea 
                          rows={3}
                          placeholder="Brief description for staff..."
                          className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 resize-none"
                          value={newItem.description}
                          onChange={e => setNewItem({...newItem, description: e.target.value})}
                       />
                    </div>
                 </div>
              </div>
              <div className="mt-8 flex gap-4">
                 <Button className="flex-1 py-4 font-black shadow-lg shadow-indigo-500/20" onClick={() => { 
                    if (!newItem.name || !newItem.imageUrl) {
                       setError("Name and Image are required.");
                       return;
                    }
                    handleSaveMenuItem(newItem as any, editingId || undefined); 
                    resetForm(); 
                 }}>
                   {editingId ? 'Update Product Configuration' : 'Save Product Configuration'}
                 </Button>
                 <Button variant="ghost" className="px-10 font-black text-slate-400" onClick={resetForm}>Discard</Button>
              </div>
           </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {menuItems.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all relative overflow-hidden">
                 {!item.isAvailable && (
                    <div className="absolute top-4 left-4 z-10 px-2 py-1 bg-rose-500 text-white text-[8px] font-black uppercase rounded shadow-sm">Out of Stock</div>
                 )}
                 <div className={`w-24 h-24 rounded-[32px] overflow-hidden mb-4 shadow-xl transition-transform group-hover:scale-105 ${!item.isAvailable ? 'grayscale opacity-50' : ''}`}>
                    <img src={item.imageUrl} className="w-full h-full object-cover" />
                 </div>
                 <h4 className={`font-black text-slate-800 leading-tight mb-1 ${!item.isAvailable ? 'opacity-50' : ''}`}>{item.name}</h4>
                 <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-4">
                    {CATEGORIES.find(c => c.id === item.categoryId)?.name} • {item.prepArea}
                 </p>
                 <div className="mt-auto w-full pt-4 border-t border-slate-50 flex flex-col gap-4">
                    <div className="flex justify-between items-center px-2">
                       <span className={`font-black text-slate-900 ${!item.isAvailable ? 'opacity-50' : ''}`}>${item.basePrice.toFixed(2)}</span>
                       <div className="flex gap-1">
                          <button 
                            onClick={() => toggleItemAvailability(item.id)}
                            className={`p-2 rounded-xl transition-all ${item.isAvailable ? 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'}`}
                            title={item.isAvailable ? "Mark as Unavailable" : "Mark as Available"}
                          >
                             {item.isAvailable ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <button 
                            onClick={() => startEdit(item)}
                            className="p-2 rounded-xl text-indigo-500 bg-indigo-50 hover:bg-indigo-100 transition-all"
                            title="Edit Item"
                          >
                             <Edit2 size={16} />
                          </button>
                          <button onClick={() => {
                             requestPermission('DELETE_MENU_ITEM', () => {
                                setMenuItems(prev => prev.filter(mi => mi.id !== item.id));
                                logAction('MENU_MODIFIED', `Item "${item.name}" deleted from menu`, 'medium');
                             });
                          }} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>
    );
  };

  const TableMapView = () => (
    <div className="p-6 h-full overflow-y-auto animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Floor Plan Management</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
             <div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Available
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
             <div className="w-3 h-3 bg-rose-500 rounded-full"></div> Occupied
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {tables.map(table => (
          <div 
            key={table.id}
            onClick={() => handleSelectTable(table)}
            className={`
              aspect-square rounded-[32px] flex flex-col items-center justify-center cursor-pointer transition-all border-2
              ${table.status === TableStatus.OCCUPIED 
                ? 'bg-rose-50 border-rose-200 text-rose-700 shadow-sm' 
                : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1'}
            `}
          >
            <Users className="mb-2 opacity-40" />
            <span className="text-3xl font-black">T-{table.number}</span>
            <span className="text-[10px] font-bold uppercase tracking-widest mt-1 opacity-60">{table.capacity} Seats</span>
          </div>
        ))}
      </div>
    </div>
  );

  const POSView = () => {
    const calculatedDiscountValue = currentOrder?.discountType === 'percentage' 
      ? (currentOrder?.subtotal || 0) * ((currentOrder?.discountValue || 0) / 100)
      : (currentOrder?.discountValue || 0);

    const editingItem = currentOrder?.items?.find(i => i.id === editingOrderItemId);
    const editingMenuItem = menuItems.find(mi => mi.id === editingItem?.menuItemId);

    return (
      <div className="flex h-full overflow-hidden animate-in fade-in duration-300">
        <div className="flex-1 flex flex-col overflow-hidden border-r border-slate-200">
          <div className="p-4 bg-white border-b border-slate-200 flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search menu items..."
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto no-scrollbar">
            {filteredMenuItems.map(item => (
              <div 
                key={item.id}
                onClick={() => item.isAvailable && addItemToOrder(item)}
                className={`bg-white p-4 rounded-3xl border transition-all group active:scale-95 relative overflow-hidden ${
                  item.isAvailable 
                  ? 'border-slate-100 hover:border-indigo-500 hover:shadow-xl cursor-pointer' 
                  : 'border-slate-100 opacity-60 cursor-not-allowed grayscale'
                }`}
              >
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-slate-100/30 flex items-center justify-center z-10">
                     <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg rotate-12">Sold Out</span>
                  </div>
                )}
                <div className="relative overflow-hidden rounded-2xl mb-4 h-32">
                   <img src={item.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={item.name} />
                   <div className="absolute top-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-black uppercase text-indigo-600 shadow-sm">
                      {item.prepArea}
                   </div>
                </div>
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold leading-tight ${item.isAvailable ? 'text-slate-800 group-hover:text-indigo-600' : 'text-slate-400'}`}>{item.name}</h3>
                  <span className={`font-black ml-2 ${item.isAvailable ? 'text-indigo-600' : 'text-slate-400'}`}>${item.basePrice.toFixed(2)}</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium line-clamp-2 mt-1">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[440px] flex flex-col bg-slate-50 overflow-hidden shadow-2xl">
          {editingItem && (
            <OrderItemDetailModal 
              item={editingItem}
              menuItem={editingMenuItem}
              isPaid={currentOrder?.status === OrderStatus.PAID}
              onClose={() => setEditingOrderItemId(null)}
              onToggleModifier={(mod) => toggleModifier(editingItem.id, mod)}
              onAddCustomModifier={(name, price) => addCustomModifier(editingItem.id, name, price)}
              onRemoveModifier={(modId) => removeModifier(editingItem.id, modId)}
              onApplyDiscount={(val, type) => applyItemDiscount(editingItem.id, val, type)}
            />
          )}

          <div className="p-6 border-b border-slate-200 bg-white shadow-sm z-10 flex justify-between items-center">
            <div>
               <h3 className="font-black text-xl text-slate-900">Order {currentOrder?.orderNumber || 'New'}</h3>
               <div className="flex items-center gap-2 mt-1">
                  <div className={`w-2 h-2 rounded-full ${selectedTable ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{selectedTable ? `Table ${selectedTable.number}` : 'Direct Service'}</p>
               </div>
            </div>
            {currentOrder?.status === OrderStatus.PAID && (
               <div className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg font-black text-[10px] uppercase tracking-tighter flex items-center gap-1 shadow-sm">
                  <Lock size={12}/> LOCKED
               </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {currentOrder?.items?.map(item => (
              <div 
                key={item.id} 
                onClick={() => setEditingOrderItemId(item.id)}
                className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4 animate-in slide-in-from-right-4 duration-200 group cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all active:scale-[0.98]"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                       <h4 className="font-black text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">{item.name}</h4>
                       <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 font-bold rounded-md uppercase">{item.prepArea}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.modifiers.length > 0 && item.modifiers.map(mod => (
                        <span key={mod.id} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full border border-indigo-100">
                          {mod.name}
                        </span>
                      ))}
                      {(item.discountValue || 0) > 0 && (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-black rounded-full border border-rose-100 flex items-center gap-1">
                          <Ticket size={10} /> {item.discountType === 'percentage' ? `${item.discountValue}%` : `$${item.discountValue}`} Off
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                     <span className="font-black text-slate-900 block">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                     <span className="text-[10px] text-slate-400 font-bold uppercase">${item.unitPrice.toFixed(2)}/ea</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                  <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => updateItemQuantity(item.id, -1)} className="p-2 rounded-lg hover:bg-white text-slate-500 transition-all shadow-sm active:scale-90"><Minus size={16}/></button>
                    <span className="text-sm font-black w-8 text-center text-slate-800">{item.quantity}</span>
                    <button onClick={() => updateItemQuantity(item.id, 1)} className="p-2 rounded-lg hover:bg-white text-slate-500 transition-all shadow-sm active:scale-90"><Plus size={16}/></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-slate-300 hover:text-indigo-500 transition-colors">
                       <Edit2 size={18} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); updateItemQuantity(item.id, -item.quantity); }} className="p-2 text-rose-300 hover:text-rose-500 transition-colors">
                       <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {(!currentOrder?.items || currentOrder.items.length === 0) && (
               <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50 py-20">
                  <ShoppingCart size={48} className="mb-4" />
                  <p className="font-black text-lg uppercase tracking-widest">Cart is Empty</p>
               </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-slate-200 space-y-3 rounded-t-[40px] shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between text-sm text-slate-500 font-bold uppercase tracking-wider">
              <span>Subtotal</span>
              <span>${(currentOrder?.subtotal || 0).toFixed(2)}</span>
            </div>
            {calculatedDiscountValue > 0 && (
              <div className="flex justify-between text-sm text-rose-500 font-black uppercase tracking-wider italic">
                <span>Discount Applied</span>
                <span>-${calculatedDiscountValue.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-2xl pt-2 border-t border-slate-100 items-center">
              <span className="text-slate-900">Total Bill</span>
              <span className="text-indigo-600 text-3xl tracking-tighter">${(currentOrder?.total || 0).toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Button variant="secondary" className="rounded-2xl py-4" onClick={() => {setCurrentOrder(null); setSelectedTable(null); setActiveTab('TABLES')}}>Exit Order</Button>
              {currentOrder?.status === OrderStatus.PAID ? (
                 <Button onClick={() => setShowReceipt(currentOrder as Order)} variant="success" className="rounded-2xl py-4 font-black">PRINT INVOICE</Button>
              ) : currentOrder?.status === OrderStatus.DRAFT ? (
                 <Button onClick={submitOrder} disabled={!currentOrder?.items?.length} className="rounded-2xl py-4 font-black shadow-lg shadow-indigo-500/20">SENT TO KITCHEN</Button>
              ) : (
                 <Button onClick={() => setShowPaymentModal(currentOrder as Order)} variant="success" className="rounded-2xl py-4 font-black shadow-lg shadow-emerald-500/20">FINALIZE PAYMENT</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const KdsView = () => {
    const stations = ['All', 'Hot', 'Cold', 'Bar', 'Bakery'];
    const kdsTickets = useMemo(() => {
      return orders
        .filter(o => [OrderStatus.PENDING, OrderStatus.PREPARING].includes(o.status))
        .map(o => {
          const filteredItems = o.items.filter(i => selectedKdsStation === 'All' || i.prepArea === selectedKdsStation);
          return { ...o, items: filteredItems };
        })
        .filter(o => o.items.length > 0)
        .sort((a, b) => a.createdAt - b.createdAt);
    }, [orders, selectedKdsStation]);

    return (
      <div className="p-8 h-full bg-slate-950 overflow-hidden flex flex-col animate-in fade-in duration-500">
        <div className="flex justify-between items-center mb-8">
           <div>
              <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                 <ChefHat size={32} className="text-indigo-500" />
                 KITCHEN DISPLAY SYSTEM
              </h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">Live Preparation Queue</p>
           </div>
           
           <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/5">
              {stations.map(station => (
                 <button
                    key={station}
                    onClick={() => setSelectedKdsStation(station)}
                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                       selectedKdsStation === station 
                       ? 'bg-indigo-600 text-white shadow-lg' 
                       : 'text-slate-500 hover:text-slate-300'
                    }`}
                 >
                    {station}
                 </button>
              ))}
           </div>
        </div>

        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 flex gap-6 no-scrollbar">
           {kdsTickets.map((ticket, index) => {
             const elapsed = Math.floor((Date.now() - ticket.createdAt) / 60000);
             const isDelayed = elapsed > 10;

             return (
              <div 
                 key={ticket.id} 
                 className={`w-[320px] flex-shrink-0 bg-white rounded-[32px] overflow-hidden flex flex-col shadow-2xl transition-all border-t-[8px] animate-in slide-in-from-right-10 duration-500 delay-[${index*100}ms]
                    ${isDelayed ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-indigo-500'}
                 `}
              >
                 <div className="p-5 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                    <div>
                       <div className="flex items-center gap-2">
                          <span className="text-2xl font-black text-slate-900">#{ticket.orderNumber.split('-')[1]}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${ticket.type === OrderType.DINE_IN ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700'}`}>
                             {ticket.type}
                          </span>
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                          {ticket.tableId ? `Table ${tables.find(t=>t.id===ticket.tableId)?.number}` : 'Direct Service'}
                       </p>
                    </div>
                    <div className={`flex items-center gap-1 font-black text-xs ${isDelayed ? 'text-rose-500 animate-pulse' : 'text-indigo-600'}`}>
                       <Timer size={14} />
                       {elapsed}m
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white no-scrollbar">
                    {ticket.items.map(item => (
                       <div key={item.id} className="relative group">
                          <div className="flex justify-between items-start">
                             <div className="flex gap-3">
                                <div className="w-6 h-6 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-black">
                                   {item.quantity}
                                </div>
                                <div>
                                   <h4 className="font-black text-slate-900 leading-tight uppercase text-sm">{item.name}</h4>
                                   {item.modifiers.map(m => (
                                      <div key={m.id} className="text-rose-500 text-[10px] font-black uppercase mt-0.5 flex items-center gap-1">
                                         <Flame size={10} /> {m.name}
                                      </div>
                                   ))}
                                </div>
                             </div>
                             {item.status === 'READY' ? (
                                <CheckCircle2 size={18} className="text-emerald-500" />
                             ) : (
                                <button className="p-2 hover:bg-emerald-50 text-slate-200 hover:text-emerald-500 transition-colors rounded-xl">
                                   <Check size={18} />
                                </button>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>

                 <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
                    <button className="py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                       Void
                    </button>
                    <button 
                       onClick={() => {
                          setOrders(prev => prev.map(o => o.id === ticket.id ? { ...o, status: OrderStatus.READY } : o));
                       }}
                       className="py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all"
                    >
                       Done
                    </button>
                 </div>
              </div>
             );
           })}

           {kdsTickets.length === 0 && (
              <div className="col-span-full flex-1 flex flex-col items-center justify-center text-white/10">
                 <ChefHat size={120} />
                 <p className="mt-4 text-3xl font-black uppercase tracking-[0.3em]">Kitchen Clear</p>
              </div>
           )}
        </div>
      </div>
    );
  };

  const SidebarItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    active: boolean;
    disabled?: boolean;
    onClick: () => void;
  }> = ({ icon, label, active, disabled, onClick }) => (
    <button 
      onClick={disabled ? undefined : onClick}
      className={`
        w-full flex items-center gap-4 px-3 py-4 rounded-2xl transition-all group relative
        ${active ? 'bg-indigo-600 text-white shadow-2xl scale-105' : disabled ? 'opacity-30 grayscale cursor-not-allowed' : 'hover:bg-white/5 hover:text-slate-200'}
      `}
    >
      <div className={`transition-transform group-active:scale-90 ${active ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`}>
        {icon}
      </div>
      <span className="hidden lg:block text-xs font-black uppercase tracking-widest">{label}</span>
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"></div>}
    </button>
  );

  // --- Session Control ---

  if (!currentUser) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="h-full flex relative text-slate-900">
      {showReceipt && (
        <ReceiptModal 
          order={showReceipt} 
          onClose={() => setShowReceipt(null)} 
          onPrint={() => handleReprintLog(showReceipt.id)}
          tableNumber={tables.find(t => t.id === showReceipt.tableId)?.number}
        />
      )}

      {showPaymentModal && (
        <PaymentModal 
          order={showPaymentModal}
          onCancel={() => setShowPaymentModal(null)}
          onPaymentComplete={(method) => completePayment(method)}
        />
      )}

      {pendingOverride && (
        <ManagerOverrideModal 
          action={pendingOverride.action} 
          onApprove={pendingOverride.execute} 
          onCancel={() => setPendingOverride(null)} 
        />
      )}

      <nav className="w-24 lg:w-72 bg-slate-950 text-slate-400 flex flex-col p-6 z-20 shadow-2xl">
        <div className="flex items-center gap-4 px-2 mb-12 mt-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-[20px] flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-indigo-500/40">Z</div>
          <div className="hidden lg:block">
             <span className="text-white font-black text-xl tracking-tighter block leading-none">ITZENBD</span>
             <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">POS Terminal</span>
          </div>
        </div>
        
        <div className="flex-1 space-y-3">
          <SidebarItem icon={<Utensils size={24}/>} label="Orders" active={activeTab === 'POS'} disabled={currentUser.role === 'KITCHEN'} onClick={() => setActiveTab('POS')} />
          <SidebarItem icon={<LayoutDashboard size={24}/>} label="Floor Plan" active={activeTab === 'TABLES'} disabled={currentUser.role === 'KITCHEN'} onClick={() => setActiveTab('TABLES')} />
          <SidebarItem icon={<ChefHat size={24}/>} label="Kitchen KDS" active={activeTab === 'KDS'} onClick={() => setActiveTab('KDS')} />
          <SidebarItem icon={<Package size={24}/>} label="Management" active={activeTab === 'INVENTORY'} disabled={currentUser.role !== 'ADMIN'} onClick={() => setActiveTab('INVENTORY')} />
          <SidebarItem icon={<FileSearch size={24}/>} label="Compliance" active={activeTab === 'REPORTS'} disabled={!['ADMIN', 'MANAGER'].includes(currentUser.role)} onClick={() => setActiveTab('REPORTS')} />
        </div>

        <div className="pt-8 mt-8 border-t border-white/5 space-y-6">
          <div className="flex items-center gap-4 px-2">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black text-white shadow-xl ${currentUser.role === 'ADMIN' ? 'bg-indigo-600' : currentUser.role === 'MANAGER' ? 'bg-amber-600' : 'bg-slate-700'}`}>
              {currentUser.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="hidden lg:block overflow-hidden">
              <p className="text-sm text-white font-black truncate leading-none">{currentUser.name}</p>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-1">{currentUser.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-rose-500/10 hover:text-rose-500 text-slate-600 transition-all font-black text-[10px] uppercase tracking-widest">
            <LogOut size={20} />
            <span className="hidden lg:block">Sign Out</span>
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col overflow-hidden bg-slate-50 z-10">
        <header className="h-20 border-b border-slate-200 bg-white flex items-center justify-between px-10">
          <div className="flex items-center gap-4">
             <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
             <h1 className="font-black text-xl text-slate-900 tracking-tight uppercase">Terminal v2.4 Active</h1>
          </div>
          <div className="flex items-center gap-6">
             <div className="flex flex-col text-right hidden sm:block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync Status</span>
                <span className="text-xs font-bold text-emerald-500 uppercase">System Encrypted & Online</span>
             </div>
             <div className="px-4 py-2 bg-slate-50 rounded-2xl flex items-center gap-3 border border-slate-100">
                <Clock size={16} className="text-indigo-600" />
                <span className="text-xs font-black text-slate-900">14:24 PM</span>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'POS' && <POSView />}
          {activeTab === 'TABLES' && <TableMapView />}
          {activeTab === 'KDS' && <KdsView />}
          {activeTab === 'REPORTS' && (
             <div className="p-10 h-full overflow-y-auto no-scrollbar">
                <ReportsView />
             </div>
          )}
          {activeTab === 'INVENTORY' && (
             <div className="p-10 h-full overflow-y-auto no-scrollbar">
                <InventoryView />
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
