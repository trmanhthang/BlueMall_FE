import {Bar} from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import {useState} from "react";

export default function MyBarChart(props) {
    const [checkAction, setCheckAction] = useState(false)

    return (
        <div>
            <button onClick={() => setCheckAction(!checkAction)}>Xem thống kê</button>

        </div>
    )


}