
import UniDomusLogo from "/UniDomusLogoWhite.png"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../constant";
import { PhotoIcon } from '@heroicons/react/24/solid'

export default function AddListingForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    "address": {
      "street": "",
      "city": "",
      "cap": "",
      "houseNum": "",
      "province": "",
      "country": "",
    },
    "typology": "",
    "description": "",
    "price": "",
    "floorArea": "",
    "availability": "",
    "photos": []
  })
  const [formDataErr, setFormDataErr] = useState({
    "addressErr": {
      "streetErr": "",
      "cityErr": "",
      "capErr": "",
      "houseNumErr": "",
      "provinceErr": "",
      "countryErr": "",
    },
    "typologyErr": "",
    "descriptionErr": "",
    "priceErr": "",
    "floorAreaErr": "",
    "availabilityErr": "",
    "photosErr": []
  })

  function handleChangeInput(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const [image, setImage] = useState([]);

  function convertToBase64(e) {
    const files = Array.from(e.target.files);
    Promise.all(files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    })).then((results) => {
      setImage(image.concat(results));
    }).catch((error) => {
      console.log("Error: ", error);
    });
  }


  function handleSubmit(e) {
    e.preventDefault();

    const bodyForm = {
      address: {
        country: formData.country ? formData.country : "Italia",
        street: formData.street,
        city: formData.city,
        cap: formData.cap,
        houseNum: formData.houseNum,
        province: formData.province,
      },
      typology: formData.typology ? formData.typology : "Camera singola",
      description: formData.description,
      price: formData.price,
      floorArea: formData.floorArea,
      availability: formData.availability,
      photos: image
    }
    fetch(`${API_BASE_URL}listing/add`, {
      method: 'POST',
      headers: {
        'x-access-token': localStorage.getItem("token"),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyForm)
    })
      .then((res) => {
        console.log("bella");

        if (res.ok) {
          console.log("ciao")
          navigate('/');
        }
        else {
          if (res.status == "400") {
            setFormData({ street: "", city: "", cap: "", houseNum: "", province: "", country: "", typology: "", description: "", price: "", floorArea: "", availability: "" })
            res.json().then((json) => {
              const errors = json.errors;
              errors.map((element) => {
                setFormDataErr({
                  ...formDataErr,
                  [`${element.field}Err`]: element.message
                })
              })
            })


          }
          else if (res.status == "500") {
            res.json().then((json) => { alert(`${json.message}: ${json.reason}`) })

          }
        }

      }
      ).catch((e) => console.log(e))
  }

  return (
    <>
      <form onSubmit={handleSubmit} method="POST">
        <div className="bg-blue-950 object-center">
          <div className="flex max-w-6xl min-h-full flex-1 flex-col justify-center px-12 py-4 lg:px-8" >
            <div className="space-y-6">
              <div className="space-y-3 border-gray-900/10 py-2  flex flex-col items-center justify-center" >
                <img
                  className="mx-auto h-28 w-auto "
                  src={UniDomusLogo}
                  alt="Unidomus"
                />
                <h1 className="text-4xl  font-semibold leading-7 text-white">Nuova inserzione</h1>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h2 className="text-2xl font-semibold leading-7 text-gray-900">Indirizzo</h2>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">
                      Stato
                    </label>
                    <div className="coutny">
                      <select
                        id="country"
                        name="country"
                        autoComplete="country"
                        required
                        value={formData.country}
                        onChange={handleChangeInput}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                      >
                        <option>Italia</option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-2 sm:col-start-1">
                    <label htmlFor="street" className="block text-sm font-medium leading-6 text-gray-900">
                      Via
                    </label>
                    <div className="street">
                      <input
                        id="street"
                        name="street"
                        type="text"
                        autoComplete="street"
                        required
                        value={formData.street}
                        onChange={handleChangeInput}
                        className="block max-w-xs w-full  rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="houseNum" className="block text-sm font-medium leading-6 text-gray-900">
                      Civico
                    </label>
                    <div className="houseNum">
                      <input
                        id="houseNum"
                        name="houseNum"
                        type="text"
                        autoComplete="houseNum"
                        required
                        value={formData.houseNum}
                        onChange={handleChangeInput}
                        className="block max-w-xs w-full w-16 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>



                  <div className="sm:col-span-2 sm:col-start-1">
                    <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                      Città
                    </label>
                    <div className="city">
                      <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="=city"
                        required
                        value={formData.city}
                        onChange={handleChangeInput}
                        className="block max-w-xs w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="province" className="block text-sm font-medium leading-6 text-gray-900">
                      Provincia
                    </label>
                    <div className="province">
                      <input
                        id="province"
                        name="province"
                        type="text"
                        autoComplete="province"
                        required
                        value={formData.province}
                        onChange={handleChangeInput}
                        className="block max-w-xs w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="cap" className="block text-sm font-medium leading-6 text-gray-900">
                      CAP
                    </label>
                    <div className="cap">
                      <input
                        id="cap"
                        name="cap"
                        type="text"
                        autoComplete="cap"
                        required
                        value={formData.cap}
                        onChange={handleChangeInput}
                        className="block max-w-xs w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-md">
                <div className="border-b border-gray-900/10 pb-10">
                  <h2 className="text-2xl font-semibold leading-7 text-gray-900">Dettagli abitazione</h2>
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                    <div className="sm:col-span-3">
                      <label htmlFor="typology" className="block text-sm font-medium leading-6 text-gray-900">
                        Tipologia
                      </label>
                      <div className="typology">
                        <select
                          id="typology"
                          name="typology"
                          autoComplete="typology"
                          required
                          value={formData.typology}
                          onChange={handleChangeInput}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                        >
                          <option>Camera singola</option>
                          <option>Camera doppia</option>
                          <option>Camera tripla</option>
                          <option>Altro...</option>
                        </select>
                      </div>
                    </div>


                    <div className="sm:col-span-2 sm:col-start-1">
                      <label htmlFor="floorArea" className="block text-sm font-medium leading-6 text-gray-900">
                        Metratura
                      </label>
                      <div className="floorArea">
                        <input
                          id="floorArea"
                          name="floorArea"
                          type="text"
                          autoComplete="floorArea"
                          required
                          value={formData.floorArea}
                          onChange={handleChangeInput}
                          className="block max-w-xs w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
                        Price
                      </label>
                      <div className="price">
                        <input
                          id="price"
                          name="price"
                          autoComplete="price"
                          required
                          value={formData.price}
                          onChange={handleChangeInput}
                          className="block max-w-xs w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                        Descrizione
                      </label>
                      <div className="description">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          value={formData.description}
                          onChange={handleChangeInput}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          defaultValue={''}
                        />
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label htmlFor="availability" className="block text-sm font-medium leading-6 text-gray-900">
                        Disponibilità
                      </label>
                      <div className="availability">

                        <input
                          id="availability"
                          name="availability"
                          autoComplete="availability"
                          value={formData.availability}
                          onChange={handleChangeInput}
                          className="block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>
                </div>


                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <div className="col-span-full">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">Inserisci foto</h2>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                      <div className="text-center">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                        <div className="mt-4 flex text-sm leading-6 text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md bg-white font-semibold  focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-700 focus-within:ring-offset-2 hover:text-blue-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              accept="image/"
                              name="file-upload"
                              type="file"
                              multiple
                              className="sr-only"
                              onChange={convertToBase64} />
                          </label>
                          {image.length === 0 && Array.isArray(image) ? (
                            <div>
                              <p className="pl-1">or drag and drop</p>
                              <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-4">
                              {image.map((imgSrc, index) => (
                                <img key={index} width={100} height={100} src={imgSrc} />
                              ))}
                            </div>
                          )}

                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6  flex items-center justify-between">
              <button

                className="rounded-md bg-red-600  px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Annulla</button>

              <button
                type="submit"
                className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Conferma
              </button>
            </div>
          </div>
        </div>
      </form>


    </>
  )
}