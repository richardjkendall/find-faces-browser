import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, Legend } from 'recharts';
import chroma from 'chroma-js';

//const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
//const COLORS = chroma.scale("Set3").colors(7);
const COLORS = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f'];
const RADIAN = Math.PI / 180;

const renderCustomisedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    if(percent > 0.10) {
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    }
};

export default class EmotionPieChart extends PureComponent {

    render() {
        console.log(COLORS);
        return (
            <PieChart width={400} height={270}>
                <Pie
                    data={this.props.data}
                    isAnimationActive={false}
                    cx={100}
                    cy={100}
                    outerRadius={100}
                    label={renderCustomisedLabel}
                    labelLine={false}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {
                        this.props.data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                    }
                </Pie>
                <Legend align="left"/>
            </PieChart>
        );
    }
}
