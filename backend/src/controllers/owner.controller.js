import prisma from "../lib/prisma.js";

export const getDashboard = async (req, res) => {
  try {
    const ownerId = req.user.userId;

    const store = await prisma.store.findUnique({
      where: {
        ownerId
      },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found"
      });
    }

    const ratings = store.ratings;

    const averageRating =
      ratings.length === 0
        ? 0
        : ratings.reduce(
            (sum, item) => sum + item.rating,
            0
          ) / ratings.length;

    const users = ratings.map((item) => ({
      userId: item.user.id,
      name: item.user.name,
      email: item.user.email,
      rating: item.rating,
      ratedAt: item.createdAt
    }));

    res.json({
      success: true,
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating: Number(averageRating.toFixed(2)),
        totalRatings: ratings.length,
        users
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load owner dashboard"
    });
  }
};