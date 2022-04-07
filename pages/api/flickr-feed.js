import axios from "axios"

export default async function handler (req, res) {
  try {
    const { data, status } = await axios.get(process.env.BASE_API)
    res.status(200).json(data)
  } catch(e) {
    res.status(500).json({
      status: 0,
      status_code: 500,
      message: e.message
    })
  }
}
