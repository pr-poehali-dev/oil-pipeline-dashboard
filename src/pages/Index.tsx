import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface SensorData {
  timestamp: string;
  pressure: number;
  temperature: number;
  flowRate: number;
}

interface Alert {
  id: string;
  level: 'critical' | 'warning' | 'info';
  message: string;
  time: string;
}

const Index = () => {
  const [currentData, setCurrentData] = useState({
    agzuPressure: 45.2,
    agzuTemperature: 68.5,
    separatorPressure: 12.8,
    separatorTemperature: 42.3,
    flowRate: 156.7,
    oilLevel: 78,
  });

  const [historyData, setHistoryData] = useState<SensorData[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([
    { id: '1', level: 'warning', message: 'Давление в АГЗУ приближается к верхнему пределу', time: '14:32' },
    { id: '2', level: 'info', message: 'Плановое обслуживание через 24 часа', time: '14:15' },
  ]);

  useEffect(() => {
    const generateInitialData = () => {
      const data: SensorData[] = [];
      const now = Date.now();
      for (let i = 20; i >= 0; i--) {
        data.push({
          timestamp: new Date(now - i * 60000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          pressure: 45 + Math.random() * 5,
          temperature: 65 + Math.random() * 8,
          flowRate: 150 + Math.random() * 15,
        });
      }
      return data;
    };

    setHistoryData(generateInitialData());

    const interval = setInterval(() => {
      setCurrentData(prev => ({
        agzuPressure: Math.max(40, Math.min(50, prev.agzuPressure + (Math.random() - 0.5) * 2)),
        agzuTemperature: Math.max(60, Math.min(75, prev.agzuTemperature + (Math.random() - 0.5) * 1.5)),
        separatorPressure: Math.max(10, Math.min(15, prev.separatorPressure + (Math.random() - 0.5) * 0.5)),
        separatorTemperature: Math.max(38, Math.min(48, prev.separatorTemperature + (Math.random() - 0.5) * 1)),
        flowRate: Math.max(140, Math.min(170, prev.flowRate + (Math.random() - 0.5) * 5)),
        oilLevel: Math.max(70, Math.min(85, prev.oilLevel + (Math.random() - 0.5) * 2)),
      }));

      setHistoryData(prev => {
        const newData = [...prev];
        newData.shift();
        newData.push({
          timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
          pressure: currentData.agzuPressure,
          temperature: currentData.agzuTemperature,
          flowRate: currentData.flowRate,
        });
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentData.agzuPressure, currentData.agzuTemperature, currentData.flowRate]);

  const getStatusColor = (value: number, min: number, max: number) => {
    if (value < min || value > max) return 'text-[#F97316]';
    if (value > max * 0.9 || value < min * 1.1) return 'text-[#FEC6A1]';
    return 'text-[#10B981]';
  };

  const getAlertStyle = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-[#F97316]/10 border-[#F97316] text-[#F97316]';
      case 'warning': return 'bg-[#FEC6A1]/10 border-[#FEC6A1] text-[#F97316]';
      default: return 'bg-[#0EA5E9]/10 border-[#0EA5E9] text-[#0EA5E9]';
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white p-6">
      <div className="max-w-[1920px] mx-auto space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">SCADA Система Мониторинга</h1>
            <p className="text-gray-400 mt-1">Автоматизированная система контроля нефтедобычи</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">Последнее обновление</div>
              <div className="text-lg font-mono">{new Date().toLocaleTimeString('ru-RU')}</div>
            </div>
            <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse"></div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-[#2A2F3C] border-[#3A4152] p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Icon name="Network" size={24} className="text-[#0EA5E9]" />
              Технологическая схема
            </h2>
            
            <div className="relative h-[400px] flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-between px-12">
                <div className="relative">
                  <div className="w-32 h-48 bg-gradient-to-br from-[#0EA5E9]/20 to-[#0EA5E9]/5 border-2 border-[#0EA5E9] rounded-lg flex flex-col items-center justify-center">
                    <Icon name="Factory" size={48} className="text-[#0EA5E9] mb-2" />
                    <div className="text-center">
                      <div className="font-semibold">АГЗУ</div>
                      <div className="text-xs text-gray-400 mt-1">Установка</div>
                    </div>
                  </div>
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-[#1A1F2C] px-3 py-1 rounded border border-[#0EA5E9]/30">
                    <div className="text-xs text-gray-400">Давление</div>
                    <div className={`text-lg font-mono ${getStatusColor(currentData.agzuPressure, 40, 48)}`}>
                      {currentData.agzuPressure.toFixed(1)} бар
                    </div>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center relative">
                  <div className="w-full h-1 bg-gradient-to-r from-[#0EA5E9] via-[#10B981] to-[#0EA5E9] relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-[slide_2s_ease-in-out_infinite]"></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1A1F2C] px-3 py-1 rounded border border-[#10B981]/30">
                    <div className="text-xs text-gray-400">Расход</div>
                    <div className={`text-lg font-mono ${getStatusColor(currentData.flowRate, 145, 165)}`}>
                      {currentData.flowRate.toFixed(1)} м³/ч
                    </div>
                  </div>
                  <Icon name="ArrowRight" size={32} className="absolute right-4 text-[#10B981] animate-pulse" />
                </div>

                <div className="relative">
                  <div className="w-32 h-48 bg-gradient-to-br from-[#10B981]/20 to-[#10B981]/5 border-2 border-[#10B981] rounded-lg flex flex-col items-center justify-center">
                    <Icon name="Container" size={48} className="text-[#10B981] mb-2" />
                    <div className="text-center">
                      <div className="font-semibold">Сепаратор</div>
                      <div className="text-xs text-gray-400 mt-1">Установка</div>
                    </div>
                  </div>
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 bg-[#1A1F2C] px-3 py-1 rounded border border-[#10B981]/30">
                    <div className="text-xs text-gray-400">Давление</div>
                    <div className={`text-lg font-mono ${getStatusColor(currentData.separatorPressure, 11, 14)}`}>
                      {currentData.separatorPressure.toFixed(1)} бар
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-[#2A2F3C] border-[#3A4152] p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Icon name="AlertTriangle" size={24} className="text-[#F97316]" />
              Аварийные сигналы
            </h2>
            
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className={`p-4 rounded-lg border ${getAlertStyle(alert.level)}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{alert.message}</div>
                      <div className="text-xs opacity-70 mt-1">{alert.time}</div>
                    </div>
                    <Badge variant="outline" className="border-current">
                      {alert.level === 'critical' ? 'Критично' : alert.level === 'warning' ? 'Внимание' : 'Инфо'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-[#3A4152]">
              <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Icon name="Gauge" size={18} className="text-[#0EA5E9]" />
                Текущие параметры
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Температура АГЗУ</span>
                    <span className={`font-mono ${getStatusColor(currentData.agzuTemperature, 62, 72)}`}>
                      {currentData.agzuTemperature.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="h-2 bg-[#1A1F2C] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#0EA5E9] to-[#10B981] transition-all"
                      style={{ width: `${(currentData.agzuTemperature / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Температура сепаратора</span>
                    <span className={`font-mono ${getStatusColor(currentData.separatorTemperature, 40, 46)}`}>
                      {currentData.separatorTemperature.toFixed(1)}°C
                    </span>
                  </div>
                  <div className="h-2 bg-[#1A1F2C] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#10B981] to-[#0EA5E9] transition-all"
                      style={{ width: `${(currentData.separatorTemperature / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Уровень нефти</span>
                    <span className={`font-mono ${getStatusColor(currentData.oilLevel, 72, 82)}`}>
                      {currentData.oilLevel.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 bg-[#1A1F2C] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#F97316] to-[#10B981] transition-all"
                      style={{ width: `${currentData.oilLevel}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-[#2A2F3C] border-[#3A4152] p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Icon name="TrendingUp" size={24} className="text-[#0EA5E9]" />
              Тренд давления и температуры
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A4152" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#8E9196"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#8E9196"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1F2C', 
                    border: '1px solid #3A4152',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="pressure" 
                  stroke="#0EA5E9" 
                  strokeWidth={2}
                  dot={false}
                  name="Давление (бар)"
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#F97316" 
                  strokeWidth={2}
                  dot={false}
                  name="Температура (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="bg-[#2A2F3C] border-[#3A4152] p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Icon name="Activity" size={24} className="text-[#10B981]" />
              Тренд расхода
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#3A4152" />
                <XAxis 
                  dataKey="timestamp" 
                  stroke="#8E9196"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#8E9196"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1F2C', 
                    border: '1px solid #3A4152',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="flowRate" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  dot={false}
                  name="Расход (м³/ч)"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes slide {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Index;
