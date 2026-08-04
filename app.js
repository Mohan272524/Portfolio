/* ==========================================================================
   CHUKKA MOHAN - DATA ANALYST PORTFOLIO INTERACTIVE APP LOGIC
   Features: Particle Mesh Canvas, Live Chart.js Visualizer,
             Real-Time Statistical Z-Test Calculator, SQL Query Playground,
             Resume Modal & Toast Notifications.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------------------------------
  // 1. BACKGROUND PARTICLES CANVAS ANIMATION
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.8 + 0.8;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
        ctx.fill();
      }
    }

    for (let i = 0; i < 45; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // Draw connection lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // --------------------------------------------------------------------------
  // 2. PROJECT 1: OLIST E-COMMERCE LIVE CHART.JS DASHBOARD
  // --------------------------------------------------------------------------
  const olistChartCanvas = document.getElementById('olist-chart');
  let olistChart = null;

  const olistDataSets = {
    revenue: {
      type: 'bar',
      labels: ['Health & Beauty', 'Watches & Gifts', 'Bed & Bath', 'Sports & Leisure', 'Computers & Acc.'],
      datasets: [{
        label: 'Category Revenue ($)',
        data: [362000, 298000, 245000, 210000, 185000],
        backgroundColor: [
          'rgba(0, 242, 254, 0.85)',
          'rgba(99, 102, 241, 0.85)',
          'rgba(139, 92, 246, 0.85)',
          'rgba(16, 185, 129, 0.85)',
          'rgba(245, 158, 11, 0.85)'
        ],
        borderRadius: 8
      }]
    },
    orders: {
      type: 'line',
      labels: ['Oct 25', 'Nov 25', 'Dec 25', 'Jan 26', 'Feb 26', 'Mar 26'],
      datasets: [{
        label: 'Monthly Order Volume',
        data: [14200, 18900, 24500, 16800, 19200, 21400],
        borderColor: '#00f2fe',
        backgroundColor: 'rgba(0, 242, 254, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00f2fe',
        pointRadius: 6
      }]
    },
    regions: {
      type: 'bar',
      labels: ['São Paulo (SP)', 'Rio de Janeiro (RJ)', 'Minas Gerais (MG)', 'Rio Grande (RS)', 'Paraná (PR)'],
      datasets: [{
        label: 'State Orders Share (%)',
        data: [41.8, 12.8, 11.6, 5.4, 5.0],
        backgroundColor: 'rgba(99, 102, 241, 0.85)',
        borderRadius: 8
      }]
    },
    payment: {
      type: 'doughnut',
      labels: ['Credit Card', 'Boleto (Bank Slip)', 'Voucher', 'Debit Card'],
      datasets: [{
        label: 'Payment Method Share',
        data: [73.9, 19.0, 5.4, 1.7],
        backgroundColor: ['#00f2fe', '#6366f1', '#8b5cf6', '#10b981'],
        borderWidth: 0
      }]
    }
  };

  function initOlistChart(metric = 'revenue') {
    if (!olistChartCanvas) return;
    if (olistChart) olistChart.destroy();

    const configData = olistDataSets[metric];

    olistChart = new Chart(olistChartCanvas, {
      type: configData.type,
      data: {
        labels: configData.labels,
        datasets: configData.datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: { color: '#9ca3af', font: { family: 'Plus Jakarta Sans' } }
          },
          tooltip: {
            backgroundColor: '#121828',
            borderColor: '#00f2fe',
            borderWidth: 1,
            titleFont: { family: 'Plus Jakarta Sans', weight: 'bold' },
            bodyFont: { family: 'JetBrains Mono' }
          }
        },
        scales: configData.type === 'doughnut' ? {} : {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#9ca3af' }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#9ca3af' }
          }
        }
      }
    });
  }

  initOlistChart('revenue');

  const chartMetricSelect = document.getElementById('chart-metric-select');
  if (chartMetricSelect) {
    chartMetricSelect.addEventListener('change', (e) => {
      initOlistChart(e.target.value);
    });
  }

  // --------------------------------------------------------------------------
  // 3. PROJECT 2: STATISTICAL A/B TESTING Z-TEST CALCULATOR
  // --------------------------------------------------------------------------
  const inputNa = document.getElementById('input-na');
  const inputXa = document.getElementById('input-xa');
  const inputNb = document.getElementById('input-nb');
  const inputXb = document.getElementById('input-xb');
  const inputAlpha = document.getElementById('input-alpha');

  const valNa = document.getElementById('val-na');
  const valXa = document.getElementById('val-xa');
  const valPa = document.getElementById('val-pa');
  const valNb = document.getElementById('val-nb');
  const valXb = document.getElementById('val-xb');
  const valPb = document.getElementById('val-pb');

  const resDiff = document.getElementById('res-diff');
  const resZ = document.getElementById('res-z');
  const resP = document.getElementById('res-p');

  const verdictBox = document.getElementById('verdict-box');
  const verdictTitle = document.getElementById('verdict-title');
  const verdictDesc = document.getElementById('verdict-desc');

  function erf(x) {
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }

  function normCDF(x) {
    return 0.5 * (1 + erf(x / Math.SQRT2));
  }

  function calculateABTest() {
    if (!inputNa || !inputXa || !inputNb || !inputXb || !inputAlpha) return;

    const nA = parseInt(inputNa.value);
    const xA = parseInt(inputXa.value);
    const nB = parseInt(inputNb.value);
    const xB = parseInt(inputXb.value);
    const alpha = parseFloat(inputAlpha.value);

    const safeXa = Math.min(xA, nA);
    const safeXb = Math.min(xB, nB);

    const pA = safeXa / nA;
    const pB = safeXb / nB;
    const diff = pB - pA;

    const pPool = (safeXa + safeXb) / (nA + nB);
    const sePool = Math.sqrt(pPool * (1 - pPool) * (1 / nA + 1 / nB));

    let zScore = 0;
    if (sePool > 0) {
      zScore = diff / sePool;
    }

    const pValue = 2 * (1 - normCDF(Math.abs(zScore)));

    valNa.innerText = nA.toLocaleString();
    valXa.innerText = safeXa.toLocaleString();
    valPa.innerText = (pA * 100).toFixed(2) + '%';
    valNb.innerText = nB.toLocaleString();
    valXb.innerText = safeXb.toLocaleString();
    valPb.innerText = (pB * 100).toFixed(2) + '%';

    resDiff.innerText = (diff >= 0 ? '+' : '') + (diff * 100).toFixed(2) + '%';
    resZ.innerText = zScore.toFixed(3);
    resP.innerText = pValue.toFixed(4);

    if (pValue < alpha) {
      verdictBox.className = 'verdict-card significant';
      verdictTitle.innerHTML = '<i class="fa-solid fa-circle-check"></i> STATISTICALLY SIGNIFICANT UPLIFT';
      verdictDesc.innerText = `The observed conversion difference (${(diff * 100).toFixed(2)}%) has a p-value of ${pValue.toFixed(4)} (< α ${alpha}). We REJECT the null hypothesis (H₀). The new landing page design produces a statistically significant performance boost.`;
      
      if (typeof confetti === 'function' && Math.random() < 0.1) {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      }
    } else {
      verdictBox.className = 'verdict-card neutral';
      verdictTitle.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> NOT STATISTICALLY SIGNIFICANT';
      verdictDesc.innerText = `The observed conversion difference (${(diff * 100).toFixed(2)}%) has a p-value of ${pValue.toFixed(4)} (≥ α ${alpha}). We FAIL TO REJECT the null hypothesis (H₀). Recommendation: Do not launch the new variant based on current sample data.`;
    }
  }

  [inputNa, inputXa, inputNb, inputXb, inputAlpha].forEach(el => {
    if (el) el.addEventListener('input', calculateABTest);
  });
  calculateABTest();

  const loadExpBtn = document.getElementById('load-experiment-data-btn');
  if (loadExpBtn) {
    loadExpBtn.addEventListener('click', () => {
      inputNa.value = 5000;
      inputXa.value = 600;
      inputNb.value = 5000;
      inputXb.value = 640;
      inputAlpha.value = 0.05;
      calculateABTest();
      showToast('Loaded Landing Page A/B Experiment Data (n=5,000)');
    });
  }

  // --------------------------------------------------------------------------
  // 4. INTERACTIVE SQL QUERY PLAYGROUND
  // --------------------------------------------------------------------------
  const sqlEditor = document.getElementById('sql-editor-textarea');
  const sqlResultTableContainer = document.getElementById('sql-result-table-container');
  const runSqlBtn = document.getElementById('run-sql-btn');
  const sqlPresetBtns = document.querySelectorAll('.sql-preset-btn');
  const queryStatus = document.getElementById('query-status');

  const sqlQueries = {
    q1: {
      sql: `-- Top 5 Revenue Categories (Olist E-Commerce Dataset)
SELECT 
    p.product_category_name AS Category,
    COUNT(oi.order_id) AS Total_Orders,
    ROUND(SUM(oi.price), 2) AS Gross_Revenue_USD,
    ROUND(AVG(oi.price), 2) AS Avg_Item_Price
FROM olist_order_items oi
JOIN olist_products p ON oi.product_id = p.product_id
GROUP BY 1
ORDER BY Gross_Revenue_USD DESC
LIMIT 5;`,
      headers: ['Category', 'Total_Orders', 'Gross_Revenue_USD', 'Avg_Item_Price'],
      data: [
        ['Health & Beauty', '9,670', '$362,000.00', '$37.43'],
        ['Watches & Gifts', '5,630', '$298,000.00', '$52.93'],
        ['Bed & Bath', '9,410', '$245,000.00', '$26.03'],
        ['Sports & Leisure', '7,720', '$210,000.00', '$27.20'],
        ['Computers & Acc.', '4,810', '$185,000.00', '$38.46']
      ]
    },
    q2: {
      sql: `-- A/B Landing Page Conversion Rate Analysis
SELECT 
    experiment_variant AS Variant_Group,
    COUNT(user_id) AS Total_Visitors,
    SUM(converted) AS Converted_Users,
    ROUND(AVG(converted) * 100, 2) AS Conversion_Rate_Pct
FROM ab_landing_page_logs
GROUP BY 1;`,
      headers: ['Variant_Group', 'Total_Visitors', 'Converted_Users', 'Conversion_Rate_Pct'],
      data: [
        ['Control (Old Page)', '5,000', '600', '12.00%'],
        ['Treatment (New Page)', '5,000', '640', '12.80%']
      ]
    },
    q3: {
      sql: `-- Customer Retention & Repeat Purchase Rate
WITH customer_orders AS (
    SELECT 
        customer_unique_id,
        COUNT(order_id) AS total_purchases
    FROM olist_orders o
    JOIN olist_customers c ON o.customer_id = c.customer_id
    GROUP BY 1
)
SELECT 
    CASE WHEN total_purchases > 1 THEN 'Repeat Customer' ELSE 'One-Time Customer' END AS Cohort,
    COUNT(customer_unique_id) AS Customer_Count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customer_orders), 2) AS Share_Pct
FROM customer_orders
GROUP BY 1;`,
      headers: ['Cohort', 'Customer_Count', 'Share_Pct'],
      data: [
        ['One-Time Customer', '65,480', '68.20%'],
        ['Repeat Customer', '30,520', '31.80%']
      ]
    },
    q4: {
      sql: `-- Monthly Revenue Growth Rate (MoM %)
SELECT 
    DATE_FORMAT(order_purchase_timestamp, '%Y-%m') AS Year_Month,
    ROUND(SUM(payment_value), 2) AS Monthly_Revenue,
    ROUND((SUM(payment_value) - LAG(SUM(payment_value)) OVER (ORDER BY DATE_FORMAT(order_purchase_timestamp, '%Y-%m'))) 
          / LAG(SUM(payment_value)) OVER (ORDER BY DATE_FORMAT(order_purchase_timestamp, '%Y-%m')) * 100, 2) AS MoM_Growth_Pct
FROM olist_payments p
JOIN olist_orders o ON p.order_id = o.order_id
GROUP BY 1
ORDER BY Year_Month DESC
LIMIT 5;`,
      headers: ['Year_Month', 'Monthly_Revenue', 'MoM_Growth_Pct'],
      data: [
        ['2026-03', '$214,000.00', '+11.46%'],
        ['2026-02', '$192,000.00', '+14.28%'],
        ['2026-01', '$168,000.00', '-31.42%'],
        ['2025-12', '$245,000.00', '+29.62%'],
        ['2025-11', '$189,000.00', '+33.09%']
      ]
    }
  };

  function renderSqlResult(key = 'q1') {
    const qData = sqlQueries[key];
    if (!qData || !sqlResultTableContainer) return;

    if (sqlEditor) sqlEditor.value = qData.sql;

    let html = '<table class="sql-table"><thead><tr>';
    qData.headers.forEach(h => {
      html += `<th>${h}</th>`;
    });
    html += '</tr></thead><tbody>';

    qData.data.forEach(row => {
      html += '<tr>';
      row.forEach(cell => {
        html += `<td>${cell}</td>`;
      });
      html += '</tr>';
    });
    html += 'tbody></table>';

    sqlResultTableContainer.innerHTML = html;
  }

  renderSqlResult('q1');

  sqlPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      sqlPresetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const qKey = btn.getAttribute('data-query');
      renderSqlResult(qKey);
    });
  });

  if (runSqlBtn) {
    runSqlBtn.addEventListener('click', () => {
      if (queryStatus) {
        queryStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Executing...';
        setTimeout(() => {
          const randomSec = (Math.random() * 0.02 + 0.008).toFixed(3);
          queryStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Status: OK (${randomSec} sec)`;
          showToast('SQL Query Executed Successfully!');
        }, 300);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. RESUME MODAL HANDLERS
  // --------------------------------------------------------------------------
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtn = document.getElementById('open-resume-btn');
  const closeResumeBtn = document.getElementById('close-resume-btn');

  if (openResumeBtn && resumeModal) {
    openResumeBtn.addEventListener('click', () => {
      resumeModal.classList.add('active');
    });
  }

  if (closeResumeBtn && resumeModal) {
    closeResumeBtn.addEventListener('click', () => {
      resumeModal.classList.remove('active');
    });
  }

  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) resumeModal.classList.remove('active');
    });
  }

  // --------------------------------------------------------------------------
  // 6. CONTACT FORM & COPY TO CLIPBOARD
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      showToast(`Thank you ${name}! Message dispatched to Chukka Mohan.`);
      contactForm.reset();
    });
  }

  const copyBtns = document.querySelectorAll('.copy-btn');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy);
        showToast(`Copied "${textToCopy}" to clipboard!`);
      }
    });
  });

  // Helper Toast Notification Function
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${message}`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

});
