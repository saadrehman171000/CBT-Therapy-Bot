'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface ProgressChartProps {
  data: Array<{
    date: string;
    mood: number;
    emotion: string;
  }>;
}

export default function ProgressChart({ data }: ProgressChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        No mood data available yet
      </div>
    )
  }

  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Mood Intensity',
        data: data.map(d => d.mood),
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1,
        pointBackgroundColor: data.map(d => {
          switch (d.emotion) {
            case 'happy':
              return '#22c55e' // green
            case 'sad':
              return '#ef4444' // red
            default:
              return '#6b7280' // gray
          }
        }),
        pointRadius: 6
      }
    ]
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#4B5563',
          font: {
            weight: '500'
          }
        },
        title: {
          display: true,
          text: 'Mood Intensity',
          color: '#374151',
          font: {
            weight: '600'
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: '#4B5563',
          font: {
            weight: '500'
          }
        },
        title: {
          display: true,
          text: 'Date',
          color: '#374151',
          font: {
            weight: '600'
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          color: '#374151',
          font: {
            weight: '600'
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#374151',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        callbacks: {
          label: (context: any) => {
            const dataPoint = data[context.dataIndex]
            return [
              `Intensity: ${dataPoint.mood}/10`,
              `Emotion: ${dataPoint.emotion}`
            ]
          }
        }
      }
    }
  }

  return (
    <div className="h-64">
      <Line data={chartData} options={options} />
    </div>
  )
} 