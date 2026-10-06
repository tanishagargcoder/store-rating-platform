import prisma from "../lib/prisma.js";

export const getStores = async (req, res) => {
  try {
    const {
      name,
      address,
      sortBy = "name",
      order = "asc"
    } = req.query;

    const stores = await prisma.store.findMany({
      where: {
        ...(name && {
          name: {
            contains: name,
            mode: "insensitive"
          }
        }),

        ...(address && {
          address: {
            contains: address,
            mode: "insensitive"
          }
        })
      },

      include: {
        ratings: {
          select: {
            rating: true,
            userId: true
          }
        }
      }
    });

    const formattedStores = stores.map((store) => {
      const ratings = store.ratings;

      const averageRating =
        ratings.length === 0
          ? 0
          : ratings.reduce(
              (sum, item) => sum + item.rating,
              0
            ) / ratings.length;

      const userRating = ratings.find(
        (item) => item.userId === req.user.userId
      );

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: Number(averageRating.toFixed(2)),
        userSubmittedRating: userRating
          ? userRating.rating
          : null
      };
    });

    formattedStores.sort((a, b) => {
      const valueA = a[sortBy] ?? "";
      const valueB = b[sortBy] ?? "";

      if (valueA < valueB) {
        return order === "desc" ? 1 : -1;
      }

      if (valueA > valueB) {
        return order === "desc" ? -1 : 1;
      }

      return 0;
    });

    res.json({
      success: true,
      stores: formattedStores
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch stores"
    });
  }
};
export const submitRating = async (req, res) => {
  try {
    const { storeId, rating } = req.body;

    const store = await prisma.store.findUnique({
      where: {
        id: storeId
      }
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found"
      });
    }

    const existingRating = await prisma.rating.findUnique({
      where: {
        userId_storeId: {
          userId: req.user.userId,
          storeId
        }
      }
    });

    let userRating;

    if (existingRating) {
      userRating = await prisma.rating.update({
        where: {
          id: existingRating.id
        },
        data: {
          rating
        }
      });
    } else {
      userRating = await prisma.rating.create({
        data: {
          userId: req.user.userId,
          storeId,
          rating
        }
      });
    }

    res.json({
      success: true,
      message: existingRating
        ? "Rating updated successfully"
        : "Rating submitted successfully",
      rating: userRating
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to submit rating"
    });
  }
};