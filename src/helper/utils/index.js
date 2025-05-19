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
  const rewardsSummary = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const points = calculateRewardPoints(transaction.amount);

    if (!rewardsSummary[key]) {
      rewardsSummary[key] = { total: 0, transactions: [] };
    }

    rewardsSummary[key].total += points;
    rewardsSummary[key].transactions.push({ ...transaction, points });
  });

  return rewardsSummary;
};

export { calculateRewardPoints, calculateRewardsByMonth };
