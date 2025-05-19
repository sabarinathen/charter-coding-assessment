const calculateRewardPoints = (amount) => {
  let points = 0;
  if (amount > 100) {
    points += (amount - 100) * 2 + 50;
  } else if (amount > 50) {
    points += amount - 50;
  }
  return Math.floor(points);
};

const groupRewardsByMonth = (transactions) => {
  const grouped = {};

  transactions.forEach((t) => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const points = calculateRewardPoints(t.amount);

    if (!grouped[key]) {
      grouped[key] = { total: 0, transactions: [] };
    }

    grouped[key].total += points;
    grouped[key].transactions.push({ ...t, points });
  });

  return grouped;
};

export { calculateRewardPoints, groupRewardsByMonth };
