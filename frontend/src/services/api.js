import axios from "axios";

// Single data-access layer. To move to WordPress, point these calls at the WP REST API
// (e.g. /wp-json/wp/v2/gym) and adapt `mapGym` to the ACF field names — UI stays untouched.
const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const client = axios.create({ baseURL: API });

export const mapGym = (g) => ({
  id: g.id,
  slug: g.slug,
  name: g.name,
  city: g.city,
  address: g.address,
  neighborhood: g.neighborhood,
  street: g.street,
  image: g.image,
  sports: g.sports || [],
  rating: g.rating,
  phone: g.phone,
  description: g.description,
  featured: Boolean(g.featured),
  badge: g.badge || null,
  landingPageRequested: Boolean(g.landingPageRequested),
  landingPageUrl: g.landingPageUrl || null,
});

const clean = (params) => Object.fromEntries(Object.entries(params).filter(([, v]) => v !== "" && v != null));

export const fileUrl = (path) => `${API}/files/${path}`;

export const getGyms = async (params = {}) => (await client.get("/gyms", { params: clean(params) })).data.map(mapGym);

export const getGym = async (slug) => mapGym((await client.get(`/gyms/${slug}`)).data);

export const getCities = async () => (await client.get("/cities")).data;

export const getSports = async () => (await client.get("/sports")).data;

export const uploadImage = async (file) => {
  const form = new FormData();
  form.append("file", file);
  return (await client.post("/uploads", form)).data;
};

export const createRegistration = async (payload) => (await client.post("/registrations", payload)).data;

export const getRegistrations = async () => (await client.get("/registrations")).data;

export const syncRegistration = async (id) => (await client.post(`/registrations/${id}/sync`)).data;

export const getWordPressStatus = async () => (await client.get("/integrations/wordpress/status")).data;
