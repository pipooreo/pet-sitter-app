export async function validateSitterForm(formData) {
  //   const formData = await req.formData();
  const name = formData.get("name");
  const experience = formData.get("experience");
  const trade_name = formData.get("trade_name");
  const address_detail = formData.get("address_detail");
  const district = formData.get("district");
  const subdistrict = formData.get("subdistrict");
  const province = formData.get("province");
  const postcode = formData.get("postcode");

  if (
    !name ||
    !experience ||
    !trade_name ||
    !address_detail ||
    !district ||
    !subdistrict ||
    !province ||
    !postcode
  ) {
    return new Response("Request data is missing", { status: 400 });
  }

  return null;
}
