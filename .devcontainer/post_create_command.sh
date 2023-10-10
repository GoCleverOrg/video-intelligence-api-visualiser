#!/usr/bin/env bash

TZ=Europe/Lisbon
ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone