import prisma from "../lib/prisma.js";
import bcrypt from "bcryptjs";

export const getDashboard = async (req, res) => {
  try {
    const totalUsers = await prisma.user.count({
      where: {
        role: "USER"
      }
    });

    const totalStores = await prisma.store.count();

    const totalRatings = await prisma.rating.count();

    res.json({
      success: true,
      data: {
        totalUsers,
        totalStores,
        totalRatings
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard"
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        address,
        password: hashedPassword,
        role
      }
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create user"
    });
  }
};

export const createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const owner = await prisma.user.findUnique({
      where: { id: ownerId }
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Store owner not found"
      });
    }

    if (owner.role !== "STORE_OWNER") {
      return res.status(400).json({
        success: false,
        message: "Selected user is not a store owner"
      });
    }

    const existingStore = await prisma.store.findUnique({
      where: { email }
    });

    if (existingStore) {
      return res.status(409).json({
        success: false,
        message: "Store email already registered"
      });
    }

    const existingOwnerStore = await prisma.store.findUnique({
      where: { ownerId }
    });

    if (existingOwnerStore) {
      return res.status(409).json({
        success: false,
        message: "This owner already has a store"
      });
    }

    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId
      }
    });

    res.status(201).json({
      success: true,
      message: "Store created successfully",
      store
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create store"
    });
  }
};
export const getUsers = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      role,
      sortBy = "name",
      order = "asc"
    } = req.query;

    const allowedSortFields = [
      "name",
      "email",
      "address",
      "role"
    ];

    const field = allowedSortFields.includes(sortBy)
      ? sortBy
      : "name";

    const sortOrder = order === "desc" ? "desc" : "asc";

    const users = await prisma.user.findMany({
      where: {
        ...(name && {
          name: {
            contains: name,
            mode: "insensitive"
          }
        }),

        ...(email && {
          email: {
            contains: email,
            mode: "insensitive"
          }
        }),

        ...(address && {
          address: {
            contains: address,
            mode: "insensitive"
          }
        }),

        ...(role && {
          role
        })
      },

      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true
      },

      orderBy: {
        [field]: sortOrder
      }
    });

    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};

export const getStores = async (req, res) => {
  try {
    const {
      name,
      email,
      address,
      sortBy = "name",
      order = "asc"
    } = req.query;

    const allowedSortFields = [
      "name",
      "email",
      "address"
    ];

    const field = allowedSortFields.includes(sortBy)
      ? sortBy
      : "name";

    const sortOrder = order === "desc" ? "desc" : "asc";

    const stores = await prisma.store.findMany({
      where: {
        ...(name && {
          name: {
            contains: name,
            mode: "insensitive"
          }
        }),

        ...(email && {
          email: {
            contains: email,
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
            rating: true
          }
        }
      },

      orderBy: {
        [field]: sortOrder
      }
    });

    const formattedStores = stores.map((store) => {
      const totalRatings = store.ratings.length;

      const averageRating =
        totalRatings === 0
          ? 0
          : store.ratings.reduce(
              (sum, item) => sum + item.rating,
              0
            ) / totalRatings;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        overallRating: Number(averageRating.toFixed(2))
      };
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
export const getUserById = async (req, res) => {
  try {
    const userId = Number(req.params.id);

    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,

        store: {
          select: {
            id: true,
            name: true,
            email: true,
            address: true,
            ratings: {
              select: {
                rating: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let store = null;

    if (user.store) {
      const ratings = user.store.ratings;

      const averageRating =
        ratings.length === 0
          ? 0
          : ratings.reduce(
              (sum, item) => sum + item.rating,
              0
            ) / ratings.length;

      store = {
        id: user.store.id,
        name: user.store.name,
        email: user.store.email,
        address: user.store.address,
        overallRating: Number(averageRating.toFixed(2))
      };
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        ...(user.role === "STORE_OWNER" && { store })
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch user"
    });
  }
};