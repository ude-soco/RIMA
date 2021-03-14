// import React, { useEffect } from "react";
// import Chart from "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.0.0-alpha.2/chart.esm.js";
// import { VennDiagramController, ArcSlice } from 'chartjs-chart-venn';

// Chart.register(VennDiagramController, ArcSlice);
// export default function DrawVenn() {
 
//     useEffect(() => {
//         const ctx = document.getElementById("myChart");
//         new Chart(ctx, {
//           type: 'venn',
//           data: ChartVenn.extractSets(
//             [
//               { label: 'Soccer', values: ['alex', 'casey', 'drew', 'hunter'] },
//               { label: 'Tennis', values: ['casey', 'drew', 'jade'] },
//               { label: 'Volleyball', values: ['drew', 'glen', 'jade'] },
//             ],
//             {
//               label: 'Sports',
//             }
//           ),
//           options: {},
//         });
//       });
//   return (
//     <div className="diag">
//       <canvas id="myChart" width="400" height="400" />
//     </div>
//   );
// }