import $ from "jquery"; // Assuming you're using jQuery

export function fetch_json_url(url) {
  return new Promise((resolve, reject) => {
    $.ajax({
      async: true,
      url: url,
      dataType: "json",
      success: function (data) {
        resolve(data);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}
