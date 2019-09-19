package datas

import (
	"encoding/csv"
	"log"
	"os"
)

var CLASS *[]string

func InitClassCSV() {
	file, err := os.Open("./data/class.csv")
	if err != nil {
		log.Fatal(err.Error())
	}
	defer file.Close()

	reader := csv.NewReader(file)

	words := make([]string, 0)
	for i := 0; ; i++ {
		line, err := reader.Read()
		if err != nil {
			break
		}
		words = append(words, line[0])
	}

	CLASS = &words
}
