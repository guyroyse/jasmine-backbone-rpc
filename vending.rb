require 'sinatra'
require 'json'

balance = 100

get '/machine' do
  content_type 'application/json'
  { :balance => balance }.to_json
end

get '/machine/setBalance/*' do |amount|
  balance = amount.to_i
  content_type 'application/json'
  { :status => 'OK' }.to_json
end