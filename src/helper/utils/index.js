const calculateRewardPoints = (amount) => {
  let points = 0;
  if (amount > 100) {
    points += (amount - 100) * 2 + 50;
  } else if (amount > 50) {
    points += amount - 50;
  }
  return Math.floor(points);
};

const calculateRewardsByMonth = (transactions) => {
  const grouped = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const points = calculateRewardPoints(transaction.amount);

    if (!grouped[key]) {
      grouped[key] = { total: 0, transactions: [] };
    }

    grouped[key].total += points;
    grouped[key].transactions.push({ ...transaction, points });
  });

  return grouped;
};

export { calculateRewardPoints, calculateRewardsByMonth };
