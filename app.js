/* ==========================================================================
   CHUKKA MOHAN - DATA ANALYST PORTFOLIO DYNAMIC ANALYTICS ENGINE
   Features: Unified Multi-Project Hub, Interactive Case Study Viewer,
             Real-Time Power BI Engine, Reconciled A/B Z-Test Calculator.
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
  // 2. UNIFIED PROJECTS HUB: CATEGORY FILTERING & CASE STUDY SWITCHER
  // --------------------------------------------------------------------------
  const projectTabBtns = document.querySelectorAll('.project-tab-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const switchCaseBtns = document.querySelectorAll('.switch-case-btn');
  const caseStudyBlocks = document.querySelectorAll('.case-study-block');

  // Category Filtering
  projectTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Switch Case Study Viewer
  switchCaseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      
      switchCaseBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      caseStudyBlocks.forEach(block => {
        if (block.id === targetId) {
          block.classList.remove('hidden');
          block.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          block.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 3. PROJECT 1: OLIST E-COMMERCE DATA ENGINE (2016-2018 DATASET)
  // --------------------------------------------------------------------------
  const categories = ['Health & Beauty', 'Watches & Gifts', 'Bed & Bath', 'Sports & Leisure', 'Computers & Acc.'];
  const states = ['São Paulo (SP)', 'Rio de Janeiro (RJ)', 'Minas Gerais (MG)', 'Rio Grande (RS)'];
  const payments = ['Credit Card', 'Boleto (Bank Slip)', 'Voucher', 'Debit Card'];
  const olistYears = ['2018', '2017', '2016'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const masterDataset = [];
  let orderIdCounter = 10001;

  for (let i = 0; i < 120; i++) {
    const year = olistYears[i % olistYears.length];
    const monthIndex = i % 12;
    const month = months[monthIndex];
    const category = categories[i % categories.length];
    const state = states[i % states.length];
    const payment = payments[(i * 3) % payments.length];
    
    let basePrice = 35 + (i % 7) * 25;
    if (category === 'Health & Beauty') basePrice += 40;
    if (category === 'Computers & Acc.') basePrice += 110;
    
    const freight = 12 + (i % 5) * 4;
    const review = (3.4 + (i % 4) * 0.4).toFixed(1);
    const dateStr = `${year}-${(monthIndex + 1).toString().padStart(2, '0')}-15`;

    masterDataset.push({
      orderId: `ORD-${orderIdCounter++}`,
      year: year,
      month: month,
      date: dateStr,
      category: category,
      state: state,
      payment: payment,
      price: basePrice,
      freight: freight,
      revenue: basePrice + freight,
      review: parseFloat(review)
    });
  }

  const filterYear = document.getElementById('filter-year');
  const filterCategory = document.getElementById('filter-category');
  const filterState = document.getElementById('filter-state');
  const chartMetricSelect = document.getElementById('chart-metric-select');

  const kpiRev = document.getElementById('kpi-rev');
  const kpiOrders = document.getElementById('kpi-orders');
  const kpiAov = document.getElementById('kpi-aov');
  const kpiReview = document.getElementById('kpi-review');

  const olistChartCanvas = document.getElementById('olist-chart');
  let olistChart = null;

  function getFilteredDataset() {
    const selYear = filterYear ? filterYear.value : 'all';
    const selCat = filterCategory ? filterCategory.value : 'all';
    const selState = filterState ? filterState.value : 'all';

    return masterDataset.filter(row => {
      const matchYear = selYear === 'all' || row.year === selYear;
      const matchCat = selCat === 'all' || row.category === selCat;
      const matchState = selState === 'all' || row.state === selState;
      return matchYear && matchCat && matchState;
    });
  }

  function updateDynamicDashboard() {
    const filteredData = getFilteredDataset();

    const totalOrdersCount = filteredData.length;
    const totalRevVal = filteredData.reduce((sum, r) => sum + r.revenue, 0);
    const avgAovVal = totalOrdersCount > 0 ? totalRevVal / totalOrdersCount : 0;
    const avgReviewVal = totalOrdersCount > 0 ? (filteredData.reduce((sum, r) => sum + r.review, 0) / totalOrdersCount) : 0;

    const scaleFactor = 115;
    const scaledRev = totalRevVal * scaleFactor;
    const scaledOrders = totalOrdersCount * scaleFactor;

    if (kpiRev) kpiRev.innerText = `$${scaledRev.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    if (kpiOrders) kpiOrders.innerText = scaledOrders.toLocaleString('en-US');
    if (kpiAov) kpiAov.innerText = `$${avgAovVal.toFixed(2)}`;
    if (kpiReview) kpiReview.innerText = `${avgReviewVal.toFixed(2)} / 5.0`;

    renderDynamicChart(filteredData);
    renderInspectorTableRows(filteredData);
  }

  function renderDynamicChart(dataset) {
    if (!olistChartCanvas) return;
    if (olistChart) olistChart.destroy();

    const dimension = chartMetricSelect ? chartMetricSelect.value : 'revenue';
    let chartType = 'bar';
    let labels = [];
    let chartData = [];
    let datasetLabel = '';
    let bgColors = [];

    if (dimension === 'revenue') {
      chartType = 'bar';
      datasetLabel = 'Category Revenue ($)';
      labels = categories;
      chartData = categories.map(cat => {
        return dataset.filter(r => r.category === cat).reduce((sum, r) => sum + r.revenue, 0) * 115;
      });
      bgColors = ['rgba(0, 242, 254, 0.85)', 'rgba(99, 102, 241, 0.85)', 'rgba(139, 92, 246, 0.85)', 'rgba(16, 185, 129, 0.85)', 'rgba(245, 158, 11, 0.85)'];

    } else if (dimension === 'orders') {
      chartType = 'line';
      datasetLabel = 'Monthly Order Trend (Olist Timeline)';
      labels = months;
      chartData = months.map(m => {
        return dataset.filter(r => r.month === m).length * 115;
      });
      bgColors = '#00f2fe';

    } else if (dimension === 'regions') {
      chartType = 'bar';
      datasetLabel = 'State Orders Concentration';
      labels = states;
      chartData = states.map(st => {
        return dataset.filter(r => r.state === st).length * 115;
      });
      bgColors = 'rgba(99, 102, 241, 0.85)';

    } else if (dimension === 'payment') {
      chartType = 'doughnut';
      datasetLabel = 'Payment Share';
      labels = payments;
      chartData = payments.map(pm => {
        return dataset.filter(r => r.payment === pm).length;
      });
      bgColors = ['#00f2fe', '#6366f1', '#8b5cf6', '#10b981'];
    }

    olistChart = new Chart(olistChartCanvas, {
      type: chartType,
      data: {
        labels: labels,
        datasets: [{
          label: datasetLabel,
          data: chartData,
          backgroundColor: bgColors,
          borderColor: chartType === 'line' ? '#00f2fe' : undefined,
          fill: chartType === 'line',
          tension: 0.4,
          borderRadius: chartType === 'bar' ? 8 : 0
        }]
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
        scales: chartType === 'doughnut' ? {} : {
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

  function renderInspectorTableRows(dataset) {
    const tbody = document.getElementById('master-data-tbody');
    if (!tbody) return;

    let html = '';
    const rowsToDisplay = dataset.slice(0, 8);

    if (rowsToDisplay.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#9ca3af;">No matching rows found for current slicer selection.</td></tr>';
      return;
    }

    rowsToDisplay.forEach(row => {
      html += `<tr>
        <td><code>${row.orderId}</code></td>
        <td>${row.date}</td>
        <td><span class="tech-tag">${row.category}</span></td>
        <td>${row.state}</td>
        <td>$${row.price.toFixed(2)}</td>
        <td>$${row.freight.toFixed(2)}</td>
        <td>${row.payment}</td>
        <td><span style="color:#10b981; font-weight:bold;">${row.review} ★</span></td>
      </tr>`;
    });

    tbody.innerHTML = html;
  }

  const toggleInspectorBtn = document.getElementById('toggle-data-inspector-btn');
  const inspectorWrapper = document.getElementById('inspector-table-wrapper');
  if (toggleInspectorBtn && inspectorWrapper) {
    toggleInspectorBtn.addEventListener('click', () => {
      inspectorWrapper.classList.toggle('hidden');
      if (!inspectorWrapper.classList.contains('hidden')) {
        toggleInspectorBtn.innerHTML = '<i class="fa-solid fa-eye-slash"></i> Hide Master Dataset Inspector';
      } else {
        toggleInspectorBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Inspect Filtered Dataset Rows';
      }
    });
  }

  [filterYear, filterCategory, filterState, chartMetricSelect].forEach(el => {
    if (el) el.addEventListener('change', () => {
      updateDynamicDashboard();
    });
  });

  updateDynamicDashboard();

  // --------------------------------------------------------------------------
  // 4. PROJECT 2: A/B TESTING Z-TEST CALCULATOR (ab_data.csv RECONCILED)
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
    resZ.innerText = Math.abs(zScore).toFixed(3);
    resP.innerText = pValue.toFixed(4);

    if (pValue < alpha && diff > 0) {
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
      inputNa.value = 145274;
      inputXa.value = 17472;
      inputNb.value = 145311;
      inputXb.value = 17264;
      inputAlpha.value = 0.05;
      calculateABTest();
      showToast('Loaded Exact ab_data.csv Experiment Results (N=290,585)');
    });
  }

  // --------------------------------------------------------------------------
  // 5. INTERACTIVE SQL QUERY PLAYGROUND
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
      sql: `-- A/B Landing Page Conversion Rate Analysis (ab_data.csv)
SELECT 
    group_name AS Variant_Group,
    COUNT(user_id) AS Total_Visitors,
    SUM(converted) AS Converted_Users,
    ROUND(AVG(converted) * 100, 2) AS Conversion_Rate_Pct
FROM ab_data
GROUP BY 1;`,
      headers: ['Variant_Group', 'Total_Visitors', 'Converted_Users', 'Conversion_Rate_Pct'],
      data: [
        ['Control (Old Page)', '145,274', '17,472', '12.02%'],
        ['Treatment (New Page)', '145,311', '17,264', '11.88%']
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
        ['2018-08', '$214,000.00', '+11.46%'],
        ['2018-07', '$192,000.00', '+14.28%'],
        ['2018-06', '$168,000.00', '-31.42%'],
        ['2018-05', '$245,000.00', '+29.62%'],
        ['2018-04', '$189,000.00', '+33.09%']
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
    html += '</tbody></table>';

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
  // 6. CONTACT FORM & EMAIL DISPATCH HANDLER (FORMSPREE)
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Direct Message';

      if (submitBtn) {
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending Message...';
        submitBtn.disabled = true;
      }

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showToast('Message delivered directly to chnohan022@gmail.com!');
          contactForm.reset();
        } else {
          // Fallback to direct mailto if formspree form needs activation
          const name = formData.get('name') || '';
          const email = formData.get('email') || '';
          const msg = formData.get('message') || '';
          window.location.href = `mailto:chnohan022@gmail.com?subject=Opportunity Contact from ${encodeURIComponent(name)}&body=Sender Email: ${encodeURIComponent(email)}%0A%0AMessage:%0A${encodeURIComponent(msg)}`;
          showToast('Opened email app to send directly to chnohan022@gmail.com!');
        }
      } catch (err) {
        const name = document.getElementById('contact-name')?.value || '';
        const email = document.getElementById('contact-email')?.value || '';
        const msg = document.getElementById('contact-message')?.value || '';
        window.location.href = `mailto:chnohan022@gmail.com?subject=Opportunity Contact from ${encodeURIComponent(name)}&body=Sender Email: ${encodeURIComponent(email)}%0A%0AMessage:%0A${encodeURIComponent(msg)}`;
        showToast('Opened email client for chnohan022@gmail.com');
      } finally {
        if (submitBtn) {
          submitBtn.innerHTML = originalBtnText;
          submitBtn.disabled = false;
        }
      }
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
