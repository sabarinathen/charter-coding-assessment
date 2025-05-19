import { calculateRewardPoints, calculateRewardsByMonth } from "../index";

describe("calculateRewardPoints", () => {
  it("should return 0 for amounts <= 50", () => {
    expect(calculateRewardPoints(0)).toBe(0);
    expect(calculateRewardPoints(30)).toBe(0);
    expect(calculateRewardPoints(50)).toBe(0);
  });

  it("should return correct points for amounts between 51 and 100", () => {
    expect(calculateRewardPoints(51)).toBe(1);
    expect(calculateRewardPoints(75)).toBe(25);
    expect(calculateRewardPoints(100)).toBe(50);
  });

  it("should return correct points for amounts > 100", () => {
    expect(calculateRewardPoints(120)).toBe(90);
    expect(calculateRewardPoints(200)).toBe(250);
    expect(calculateRewardPoints(101)).toBe(52);
  });
});

describe("calculateRewardsByMonth", () => {
  const mockTransactions = [
    {
      customerId: 1,
      transactionId: "T1",
      amount: 120,
      date: "2025-03-15",
    },
    {
      customerId: 1,
      transactionId: "T2",
      amount: 80,
      date: "2025-03-25",
    },
    {
      customerId: 1,
      transactionId: "T3",
      amount: 200,
      date: "2025-04-01",
    },
  ];

  it("should group transactions by year-month key", () => {
    const grouped = calculateRewardsByMonth(mockTransactions);

    expect(Object.keys(grouped)).toEqual(["2025-3", "2025-4"]);

    expect(grouped["2025-3"].transactions.length).toBe(2);
    expect(grouped["2025-4"].transactions.length).toBe(1);
  });

  it("should calculate total reward points per month", () => {
    const grouped = calculateRewardsByMonth(mockTransactions);

    expect(grouped["2025-3"].total).toBe(120);

    expect(grouped["2025-4"].total).toBe(250);
  });

  it("should include points on each transaction object", () => {
    const grouped = calculateRewardsByMonth(mockTransactions);
    const marchTransactions = grouped["2025-3"].transactions;

    expect(marchTransactions[0]).toHaveProperty("points");
    expect(typeof marchTransactions[0].points).toBe("number");
  });

  it("should return an empty object for empty input", () => {
    expect(calculateRewardsByMonth([])).toEqual({});
  });
});
