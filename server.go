package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

type data struct {
	phrases []string
	image   string
}

type formData struct {
	index int
}

func main() {
	r := mux.NewRouter()

	var dummy = data{phrases: []string{"パイナップルのファイアサラマンダーにして、ジグソーパズル蒸気機関車ミニチュアピンシャークレードル、フクロテナガザルはスポットライト白衣の粉をカセット、エスプレッソマシーンは最後の香を"}, image: "base64..."}

	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("public")))).Methods("GET")

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		formFile, _, err := r.FormFile("imagefile")
		if err != nil {
			log.Fatal(err.Error())
		}
		defer formFile.Close()

		formValue := r.FormValue("feature")
		datas := []formData{}

		json.Unmarshal([]byte(formValue), &datas)
		for _, v := range dummy.phrases {
			fmt.Fprintf(w, v+"\n")
		}
	}).Methods("POST")

	srv := &http.Server{
		Handler: r,
		Addr:    ":8000",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
