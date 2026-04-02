import { useState } from 'react';
import { gyeongnamCities, GyeongnamCity } from '@/data/gyeongnam';
import { X, MapPin, Users, Ruler, Star } from 'lucide-react';

interface GyeongnamExplorerProps {
  onClose: () => void;
}

const GyeongnamExplorer = ({ onClose }: GyeongnamExplorerProps) => {
  const [selectedCity, setSelectedCity] = useState<GyeongnamCity | null>(null);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b flex items-center justify-between bg-primary/10">
          <h2 className="text-lg font-bold text-foreground">🗺️ 경상남도 시·군 탐색</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground cursor-pointer"><X size={20} /></button>
        </div>

        {!selectedCity ? (
          <div className="p-4 overflow-auto max-h-[70vh]">
            <p className="text-sm text-muted-foreground mb-4">경상남도의 18개 시·군을 선택하여 지명 유래, 마스코트, 인구 등을 알아보세요!</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {gyeongnamCities.map(city => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                >
                  <span className="text-2xl">{city.mascotEmoji}</span>
                  <span className="text-sm font-bold text-foreground">{city.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 overflow-auto max-h-[70vh]">
            <button
              onClick={() => setSelectedCity(null)}
              className="text-sm text-primary font-medium mb-3 cursor-pointer hover:underline"
            >
              ← 시·군 목록으로
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedCity.mascotEmoji}</span>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedCity.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCity.nameHanja}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted/50 rounded-xl p-3 flex items-start gap-2">
                  <Users size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">인구</p>
                    <p className="text-sm font-bold text-foreground">{selectedCity.population.toLocaleString()}명</p>
                  </div>
                </div>
                <div className="bg-muted/50 rounded-xl p-3 flex items-start gap-2">
                  <Ruler size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">면적</p>
                    <p className="text-sm font-bold text-foreground">{selectedCity.area} km²</p>
                  </div>
                </div>
              </div>

              <div className="bg-muted/50 rounded-xl p-3 flex items-start gap-2">
                <span className="text-lg flex-shrink-0">{selectedCity.mascotEmoji}</span>
                <div>
                  <p className="text-xs text-muted-foreground">마스코트</p>
                  <p className="text-sm font-bold text-foreground">{selectedCity.mascot}</p>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} className="text-primary" />
                  <p className="text-sm font-bold text-foreground">지명 유래</p>
                </div>
                <p className="text-sm text-foreground leading-relaxed">{selectedCity.nameOrigin}</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Star size={16} className="text-primary" />
                  <p className="text-sm font-bold text-foreground">대표 명소·특징</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedCity.highlights.map((h, i) => (
                    <span key={i} className="px-3 py-1 bg-muted rounded-full text-xs font-medium text-foreground">{h}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GyeongnamExplorer;
