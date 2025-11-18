import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, PieLabelRenderProps } from "recharts";

interface ProbabilityDistributionProps {
  adaboostProbabilities: number[];
  diseaseType?: "alzheimer" | "parkinson";
}

const ProbabilityDistribution = ({ 
  adaboostProbabilities, 
  diseaseType = "alzheimer" 
}: ProbabilityDistributionProps) => {
  
  // Gestion des données selon le type de maladie
  const getChartData = () => {
    if (diseaseType === "parkinson") {
      // Parkinson: 2 classes [HC, PD]
      return [
        { 
          name: "Healthy Control (HC)", 
          value: (adaboostProbabilities[0] || 0) * 100,
          color: "#22c55e" // vert
        },
        { 
          name: "Parkinson's Disease (PD)", 
          value: (adaboostProbabilities[1] || 0) * 100,
          color: "#ef4444" // rouge
        }
      ];
    } else {
      // Alzheimer: 3 classes [CN, AD, MCI]
      return [
        { 
          name: "Cognitively Normal (CN)", 
          value: (adaboostProbabilities[0] || 0) * 100,
          color: "#22c55e" // vert
        },
        { 
          name: "Alzheimer's Disease (AD)", 
          value: (adaboostProbabilities[1] || 0) * 100,
          color: "#ef4444" // rouge
        },
        { 
          name: "Mild Cognitive Impairment (MCI)", 
          value: (adaboostProbabilities[2] || 0) * 100,
          color: "#facc15" // jaune
        }
      ];
    }
  };

  const chartData = getChartData();
  const totalValue = chartData.reduce((sum, item) => sum + item.value, 0);

  // Ajuster les valeurs si la somme n'est pas 100% (arrondis)
  const normalizedData = totalValue > 0 ? chartData : chartData.map(item => ({
    ...item,
    value: 100 / chartData.length // Répartition égale si pas de données
  }));

  // Correct label function with proper typing
  const renderCustomizedLabel = ({
    name, 
    percent, 
    value
  }: PieLabelRenderProps & {
    name?: string;
    percent?: number;
    value?: number;
  }) => {
    if (!name || percent === undefined || value === undefined || value <= 5) {
      return null;
    }
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={normalizedData}
              cx="50%"
              cy="50%"
              innerRadius={diseaseType === "parkinson" ? 80 : 60}
              outerRadius={diseaseType === "parkinson" ? 120 : 100}
              paddingAngle={2}
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {normalizedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            {/*   <Tooltip 
              formatter={(value: number) => [`${value.toFixed(1)}%`, 'Probability']}
              labelFormatter={(label) => `Class: ${label}`}
            />
            <Legend 
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              wrapperStyle={{ paddingTop: '20px' }}
            />*/}
          </PieChart>
        </ResponsiveContainer>
        
        {/* Légende détaillée */}

        <div className="mt-4 text-center">
          <h4 className="font-semibold text-sm mb-2">
            {diseaseType === "parkinson" 
              ? "Parkinson's Disease Probability Distribution" 
              : "Alzheimer's Disease Probability Distribution"}
          </h4>
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            {normalizedData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span>{item.name}: {item.value.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProbabilityDistribution;