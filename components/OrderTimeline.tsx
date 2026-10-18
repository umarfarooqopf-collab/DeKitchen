import React from 'react';
import { OrderStatus, OrderTimelineEvent } from '@/types';
import {
  FileText,
  CheckCircle,
  ChefHat,
  Truck,
  HeartHandshake,
  XCircle,
} from 'lucide-react';

interface OrderTimelineProps {
  status: OrderStatus;
  timeline: OrderTimelineEvent[];
}

export default function OrderTimeline({ status, timeline }: OrderTimelineProps) {
  if (status === 'cancelled') {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-3xl text-center space-y-2">
        <XCircle className="w-10 h-10 text-red-400 mx-auto" />
        <h3 className="text-lg font-bold text-red-400">Order Cancelled</h3>
        <p className="text-xs text-gray-400">This order has been cancelled by the restaurant or customer.</p>
      </div>
    );
  }

  const steps: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
    { key: 'pending', label: 'Order Placed', desc: 'Received by system', icon: FileText },
    { key: 'confirmed', label: 'Accepted', desc: 'Kitchen acknowledged', icon: CheckCircle },
    { key: 'preparing', label: 'In Kitchen', desc: 'Chefs cooking dishes', icon: ChefHat },
    { key: 'out_for_delivery', label: 'On The Way', desc: 'Courier en route', icon: Truck },
    { key: 'delivered', label: 'Delivered', desc: 'Enjoy your meal!', icon: HeartHandshake },
  ];

  const statusOrder: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];
  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="space-y-6">
      {/* Horizontal Steps Bar on Desktop */}
      <div className="relative">
        <div className="hidden md:flex items-center justify-between relative z-10">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= currentIndex;
            const isCurrent = idx === currentIndex;

            return (
              <div key={step.key} className="flex flex-col items-center text-center flex-1">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isCurrent
                      ? 'bg-primary text-dark-950 ring-4 ring-primary/20 shadow-glow scale-110'
                      : isCompleted
                      ? 'bg-primary/20 text-primary border border-primary/40'
                      : 'bg-dark-800 text-dark-500 border border-dark-700'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h4
                  className={`text-xs font-bold mt-2.5 ${
                    isCompleted ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </h4>
                <p className="text-[11px] text-gray-500 max-w-[90px]">{step.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Desktop Connector Line */}
        <div className="hidden md:block absolute top-6 left-12 right-12 h-1 bg-dark-800 -z-0">
          <div
            className="h-full bg-primary transition-all duration-500 shadow-glow"
            style={{
              width: `${(Math.max(0, currentIndex) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Vertical Mobile Timeline or detailed event log */}
      <div className="space-y-4 pt-4 border-t border-dark-800">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Live Tracking Activity Log
        </h4>
        <div className="space-y-3">
          {timeline.slice().reverse().map((event, idx) => (
            <div key={idx} className="flex items-start gap-3 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 shadow-glow flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white capitalize">
                    {event.status.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-gray-400 text-[11px] mt-0.5">{event.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
