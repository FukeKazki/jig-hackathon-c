package main

import (
	"encoding/json"
	"fmt"
	"jig-hackathon-c/pkg/datas"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"time"

	"github.com/gorilla/mux"
)

type FormData struct {
	Index int `json:"index"`
}

func main() {

	datas.InitClassCSV()

	r := mux.NewRouter()

	r.PathPrefix("/").Handler(http.StripPrefix("/", http.FileServer(http.Dir("public")))).Methods("GET")

	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)

		featureValue := r.FormValue("feature")
		imageFile, _, err := r.FormFile("imagefile")
		if err != nil {
			log.Fatal(err.Error())
		}
		defer imageFile.Close()

		file, err := os.Create("./storage/image_" + strconv.FormatInt(time.Now().UTC().UnixNano(), 10) + ".img")
		if err != nil {
			log.Fatal(err.Error())
		}
		defer file.Close()

		var image []byte
		imageFile.Read(image)
		file.Write(image)

		formDatas := []FormData{}
		json.Unmarshal([]byte(featureValue), &formDatas)
		args := make([]string, 0, len(formDatas))
		for _, v := range formDatas {
			args = append(args, (*datas.CLASS)[v.Index%len((*datas.CLASS))])
		}

		execResult, err := exec.Command("python", append([]string{"src/algorithm.py"}, args...)...).Output()
		if err != nil {
			log.Fatal(err.Error())
		}

		fmt.Fprintf(w, string(execResult)+"\n")
	}).Methods("POST")

	srv := &http.Server{
		Handler:      r,
		Addr:         ":8000",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
