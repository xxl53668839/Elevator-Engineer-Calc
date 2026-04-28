import React, { useState } from 'react';
import { Settings, Zap, ArrowRight, Calculator, Gauge, Cpu, Activity, Ruler, Plug } from 'lucide-react';
import { cn } from './lib/utils';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, className, ...props }) => (
  <div className={cn("flex flex-col gap-1 w-full", className)}>
    <label className="label-text">{label}</label>
    <input 
      className="input-field"
      {...props}
    />
  </div>
);

const ResultBox: React.FC<{ label: string; value: string | number; unit?: string }> = ({ label, value, unit }) => (
  <div className="mt-4 p-3 bg-white/5 rounded border border-white/10 flex items-center justify-between">
    <span className="label-text !mb-0">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-xl result-text">{value}</span>
      {unit && <span className="text-[10px] text-slate-400 font-mono">{unit}</span>}
    </div>
  </div>
);

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; options: {label: string; value: string | number}[] }> = ({ label, options, className, ...props }) => (
  <div className={cn("flex flex-col gap-1 w-full", className)}>
    <label className="label-text">{label}</label>
    <select 
      className="input-field [&>option]:bg-slate-900"
      {...props}
    >
      {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

function SpeedCalculator() {
  const [rpm, setRpm] = useState<string>('');
  const [gearNumerator, setGearNumerator] = useState<number>(1);
  const [gearDenominator, setGearDenominator] = useState<string>('');
  const [sheaveDiameter, setSheaveDiameter] = useState<string>('');

  const rpmNum = Number(rpm);
  const denominatorNum = Number(gearDenominator);
  const sheaveNum = Number(sheaveDiameter);

  const speed = denominatorNum > 0 ? ((rpmNum * gearNumerator / denominatorNum) * (sheaveNum / 1000) * 3.14).toFixed(2) : 0;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-4 bg-blue-500 rounded-[1px]"></div>
        <h3 className="text-sm font-semibold tracking-wide text-white">1. 電梯速度 (Elevator Speed)</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="額定轉速 (RPM)" type="number" value={rpm} onChange={e => setRpm(e.target.value)} />
        <InputField label="輪徑 (mm)" type="number" value={sheaveDiameter} onChange={e => setSheaveDiameter(e.target.value)} />
        <div className="flex flex-col gap-1 w-full sm:col-span-2">
          <label className="label-text">齒輪比 (Gear Ratio)</label>
          <div className="flex items-center gap-2">
            <select 
              className="input-field !w-20 shrink-0 [&>option]:bg-slate-900 !px-1 text-center" 
              value={gearNumerator} 
              onChange={e => setGearNumerator(Number(e.target.value))}
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
            </select>
            <span className="text-slate-400 font-mono shrink-0 px-1">/</span>
            <input 
              className="input-field w-full" 
              type="number" 
              placeholder="輸入齒輪比數值"
              value={gearDenominator} 
              onChange={e => setGearDenominator(e.target.value)} 
            />
          </div>
        </div>
      </div>
      <ResultBox label="計算速度" value={speed} unit="M/min" />
    </div>
  );
}

function PMMotorSyncSpeed() {
  const [hz, setHz] = useState<string>('');
  const [poles, setPoles] = useState<string>('');

  const polesNum = Number(poles);
  const rpm = polesNum > 0 ? (120 * Number(hz) / polesNum).toFixed(2) : 0;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-4 bg-indigo-500 rounded-[1px]"></div>
        <h3 className="text-sm font-semibold tracking-wide text-white">2. PM馬達同步轉速</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="頻率 Hz" type="number" value={hz} onChange={e => setHz(e.target.value)} />
        <InputField label="馬達極數 P" type="number" value={poles} onChange={e => setPoles(e.target.value)} />
      </div>
      <ResultBox label="同步轉速" value={rpm} unit="RPM" />
    </div>
  );
}

function IMMotorRatedSpeed() {
  const [hz, setHz] = useState<string>('');
  const [poles, setPoles] = useState<string>('');
  const slip = 0.955;

  const polesNum = Number(poles);
  const rpm = polesNum > 0 ? (120 * Number(hz) / polesNum * slip).toFixed(2) : 0;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-4 bg-purple-500 rounded-[1px]"></div>
        <h3 className="text-sm font-semibold tracking-wide text-white">3. IM馬達額定轉速</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="頻率 Hz" type="number" value={hz} onChange={e => setHz(e.target.value)} />
        <InputField label="馬達極數 P" type="number" value={poles} onChange={e => setPoles(e.target.value)} />
      </div>
      <ResultBox label="額定轉速" value={rpm} unit="RPM" />
    </div>
  );
}

function SuggestedMotorCapacity() {
  const [speed, setSpeed] = useState<string>('');
  const [load, setLoad] = useState<string>('');
  const balance = 0.55;
  const [efficiency, setEfficiency] = useState<number>(0.5);

  const kw = efficiency > 0 ? ((Number(speed) * Number(load) * balance) / (6120 * efficiency)).toFixed(2) : 0;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-4 bg-emerald-400 rounded-[1px]"></div>
        <h3 className="text-sm font-semibold tracking-wide text-white">4. 建議的馬達容量值 (KW)</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="速度 (M/min)" type="number" value={speed} onChange={e => setSpeed(e.target.value)} />
        <InputField label="車廂載重 (KG)" type="number" value={load} onChange={e => setLoad(e.target.value)} />
        <SelectField 
          className="sm:col-span-2"
          label="齒輪效率" 
          value={efficiency} 
          onChange={e => setEfficiency(Number(e.target.value))}
          options={[
            {label: 'IM - 掛比 1:1', value: 0.5},
            {label: 'IM - 掛比 2:1', value: 0.45},
            {label: 'PM - 掛比 1:1', value: 0.85},
            {label: 'PM - 掛比 2:1', value: 0.8},
          ]}
        />
      </div>
      <ResultBox label="建議容量" value={kw} unit="KW" />
    </div>
  );
}

function ActualMotorCapacity() {
  const [speed, setSpeed] = useState<string>('');
  const [load, setLoad] = useState<string>('');
  const balance = 0.55;
  const overload = 1.2;

  const kw = ((Number(speed) * Number(load) * balance * overload) / 6120).toFixed(2);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-4 bg-emerald-500 rounded-[1px]"></div>
        <h3 className="text-sm font-semibold tracking-wide text-white">5. 實際的馬達容量值 (KW)</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="速度 (M/min)" type="number" value={speed} onChange={e => setSpeed(e.target.value)} />
        <InputField label="車廂載重 (KG)" type="number" value={load} onChange={e => setLoad(e.target.value)} />
      </div>
      <ResultBox label="實際容量" value={kw} unit="KW" />
    </div>
  );
}

function RopeTravel() {
  const [floors, setFloors] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [doorHeight, setDoorHeight] = useState<string>('');

  const cm = (Number(floors) * Number(height) - (Number(doorHeight) / 500)).toFixed(1);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-4 bg-orange-400 rounded-[1px]"></div>
        <h3 className="text-sm font-semibold tracking-wide text-white">5. 鋼索行程估算 (CM)</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="樓停數" type="number" value={floors} onChange={e => setFloors(e.target.value)} />
        <InputField label="每樓高度 (CM)" type="number" value={height} onChange={e => setHeight(e.target.value)} />
        <InputField className="sm:col-span-2" label="層門高度 (CM)" type="number" value={doorHeight} onChange={e => setDoorHeight(e.target.value)} />
      </div>
      <ResultBox label="鋼索行程" value={cm} unit="CM" />
    </div>
  );
}

function DCPower() {
  const [voltage, setVoltage] = useState<string>('');
  const [resistance, setResistance] = useState<string>('');

  const resNum = Number(resistance);
  const power = resNum > 0 ? ((Number(voltage) * Number(voltage)) / resNum).toFixed(2) : 0;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-4 bg-yellow-400 rounded-[1px]"></div>
        <h3 className="text-sm font-semibold tracking-wide text-white">6. 直流電功率 (W)</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="電壓 V" type="number" value={voltage} onChange={e => setVoltage(e.target.value)} />
        <InputField label="電阻 R (Ω)" type="number" value={resistance} onChange={e => setResistance(e.target.value)} />
      </div>
      <ResultBox label="功率" value={power} unit="W" />
    </div>
  );
}

function AC3PhasePower() {
  const [voltage, setVoltage] = useState<string>('');
  const [current, setCurrent] = useState<string>('');
  const [powerFactor, setPowerFactor] = useState<number>(0.8);

  const power = (1.732 * Number(voltage) * Number(current) * powerFactor).toFixed(2);

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-4 bg-red-400 rounded-[1px]"></div>
        <h3 className="text-sm font-semibold tracking-wide text-white">7. 三相交流電機功率 (W)</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="電壓 V" type="number" value={voltage} onChange={e => setVoltage(e.target.value)} />
        <InputField label="電流 I" type="number" value={current} onChange={e => setCurrent(e.target.value)} />
        <SelectField 
          className="sm:col-span-2"
          label="功率因數" 
          value={powerFactor} 
          onChange={e => setPowerFactor(Number(e.target.value))}
          options={[
            {label: 'PM', value: 0.8},
            {label: 'IM', value: 0.7},
          ]}
        />
      </div>
      <ResultBox label="功率" value={power} unit="W" />
    </div>
  );
}

function OhmsLaw() {
  const [current, setCurrent] = useState<string>('');
  const [resistance, setResistance] = useState<string>('');
  const [voltage, setVoltage] = useState<string>('');
  const [editHistory, setEditHistory] = useState<('V' | 'I' | 'R')[]>([]);

  const handleInput = (field: 'V' | 'I' | 'R', val: string) => {
    let newHistory = editHistory.filter(f => f !== field);
    newHistory.push(field);
    setEditHistory(newHistory);

    let v = field === 'V' ? val : voltage;
    let i = field === 'I' ? val : current;
    let r = field === 'R' ? val : resistance;

    if (field === 'V') setVoltage(val);
    if (field === 'I') setCurrent(val);
    if (field === 'R') setResistance(val);

    if (val === '') return;

    const lastTwo = newHistory.slice(-2);
    if (lastTwo.includes('V') && lastTwo.includes('I')) {
       if (Number(i) !== 0 && i !== '') setResistance(String(parseFloat((Number(v) / Number(i)).toFixed(2))));
    } else if (lastTwo.includes('V') && lastTwo.includes('R')) {
       if (Number(r) !== 0 && r !== '') setCurrent(String(parseFloat((Number(v) / Number(r)).toFixed(2))));
    } else if (lastTwo.includes('I') && lastTwo.includes('R')) {
       if (i !== '' && r !== '') setVoltage(String(parseFloat((Number(i) * Number(r)).toFixed(2))));
    }
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-4 bg-yellow-500 rounded-[1px]"></div>
        <h3 className="text-sm font-semibold tracking-wide text-white">8. 歐姆定理</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <InputField label="電壓 V" type="number" value={voltage} onChange={e => handleInput('V', e.target.value)} />
        <InputField label="電流 I" type="number" value={current} onChange={e => handleInput('I', e.target.value)} />
        <InputField label="電阻 R (Ω)" type="number" value={resistance} onChange={e => handleInput('R', e.target.value)} />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white">
              ELEVATOR <span className="font-bold text-blue-400">ENGINEER-CALC</span>
              <span className="text-xs align-top opacity-50 px-2 font-mono">V2.0-Powered by Giti Nicestep CO.,LTD.</span>
            </h1>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-[10px] uppercase tracking-widest text-slate-400">電梯工程師專用計算機</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <SpeedCalculator />
          <PMMotorSyncSpeed />
          <IMMotorRatedSpeed />
          <SuggestedMotorCapacity />
          {/* <ActualMotorCapacity /> */}
          <RopeTravel />
          <DCPower />
          <AC3PhasePower />
          <OhmsLaw />
        </div>

        <footer className="pt-8 flex justify-between items-center text-[10px] text-slate-500 font-mono tracking-tighter">
          <div>ENGINEERING CALCULATIONS BASED ON ISO/CNS STANDARDS</div>
          <div>© {new Date().getFullYear()} GITI NICESTEP CO.,LTD.</div>
        </footer>
      </div>
    </div>
  );
}

