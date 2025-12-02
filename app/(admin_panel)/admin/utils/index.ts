export const fetchYards = async () => {
  const res = await fetch(`/api/yards`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch yards");
  }
  return res.json();
};

export const addYard = async (data: any) => {
  const res = await fetch(`/api/yards`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to add yard");
  }
  return res.json();
};

export const fetchProductTypes = async () => {
  const res = await fetch(`/api/product-types`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch product types");
  }
  return res.json();
};

export const addProductType = async (data: any) => {
  const res = await fetch(`/api/product-types`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error("Failed to add product type");
  }
  return res.json();
};

export const updateProductType = async (data: any, id: string) => {
  console.log("Updating product type with ID:", id, "and data:", data);
  const res = await fetch(`/api/product-types/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to update product type");
  }
  return res.json();;
}