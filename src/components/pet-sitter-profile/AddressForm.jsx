import React from "react";

export default function AddressForm() {
  return (
    <div className="bg-white rounded-3xl px-14 py-8 flex flex-col gap-6">
      <h1 className="text-head4 text-gray-300">Address</h1>
      <div className=" flex flex-col gap-1 text-black">
        <label htmlFor="address">Address detail*</label>
        <input
          id="address"
          className="bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
          type="text"
        />
      </div>
      <div className="flex gap-3">
        <div className="w-1/2 flex flex-col gap-1 text-black">
          <label htmlFor="district">District*</label>
          <select
            id="district"
            className="bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            defaultValue=""
          >
            <option value="" disabled></option>
            <option value="a">a</option>
            <option value="b">b</option>
            <option value="c">c</option>
            <option value="d">d</option>
          </select>
        </div>
        <div className="w-1/2 flex flex-col gap-1 text-black">
          <label htmlFor="subDistrict">Sub-district*</label>
          <select
            id="subDistrict"
            className="bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            defaultValue=""
          >
            <option value="" disabled></option>
            <option value="a">a</option>
            <option value="b">b</option>
            <option value="c">c</option>
            <option value="d">d</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="w-1/2 flex flex-col gap-1 text-black">
          <label htmlFor="province">Province*</label>
          <select
            id="province"
            className="bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            defaultValue=""
          >
            <option value="" disabled></option>
            <option value="a">a</option>
            <option value="b">b</option>
            <option value="c">c</option>
            <option value="d">d</option>
          </select>
        </div>
        <div className="w-1/2 flex flex-col gap-1 text-black">
          <label htmlFor="postalCode">Post Code*</label>
          <input
            id="postCode"
            className="bg-white border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            type="text"
          />
        </div>
      </div>
      <div className="w-full">
        <img className="w-full h-full" src="/google-map-ex.png" alt="" />
      </div>
    </div>
  );
}
