import { getGlobalInfrastructureStatus } from "@/lib/status-api";
import { Cloud, CheckCircle2, AlertTriangle, ShieldAlert, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

/**
 * StatusGrid Component
 * High-density "Mission Control" dashboard for real-time infrastructure health.
 */
export async function StatusGrid() {
  const services = await getGlobalInfrastructureStatus();

  if (!services.length) return <div className="min-h-[450px] md:min-h-[250px] bg-slate-950" />;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "operational":
        return {
          color: "bg-emerald-500",
          text: "Healthy",
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        };
      case "degraded":
        return {
          color: "bg-amber-500",
          text: "Degraded",
          icon: <AlertTriangle className="h-4 w-4 text-amber-500" />
        };
      default:
        return {
          color: "bg-rose-500",
          text: "Critical",
          icon: <ShieldAlert className="h-4 w-4 text-rose-500" />
        };
    }
  };

  return (
    <div className="w-full bg-slate-950 py-12 border-y border-white/5 relative overflow-hidden group min-h-[450px] md:min-h-[250px]">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">

          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl">
              <Activity className="h-6 w-6 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.6)] animate-pulse" />
            </div>
            <div>
              <h2 className="text-white font-black tracking-tight text-lg flex items-center gap-2 uppercase">
                Global Infrastructure Health
                <Badge variant="outline" className="border-emerald-500/20 text-emerald-400 bg-emerald-500/5 text-[9px] uppercase tracking-widest font-black">
                  Live
                </Badge>
              </h2>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-tighter opacity-70">
                Real-time monitoring of major enterprise cloud services
              </p>
            </div>
          </div>

          {/* Status Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-grow max-w-4xl">
            {services.map((service) => {
              const config = getStatusConfig(service.status);
              return (
                <div
                  key={service.id}
                  className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 p-4 rounded-2xl transition-all duration-300 group/card cursor-help"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Cloud className="h-4 w-4 text-slate-400 group-hover/card:text-primary transition-colors" />
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${config.color} shadow-[0_0_8px] shadow-${config.color.split('-')[1]}-500/50 animate-pulse`} />
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">{config.text}</span>
                    </div>
                  </div>
                  <h3 className="text-slate-200 font-bold text-sm tracking-tight">{service.name}</h3>
                  <p className="text-slate-500 text-[9px] font-black uppercase tracking-tighter mt-1">
                    {service.provider} Architecture
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
