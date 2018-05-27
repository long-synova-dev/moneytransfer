using System.Collections.Generic;
using System.Linq;
using System.IO;
using System;
using System.Reflection;
using System.ComponentModel.DataAnnotations;
using MoneyTransferApp.Web.Models.CommonViewModels;
using System.Text;
using Newtonsoft.Json;

namespace MoneyTransferApp.Web.Common
{
    public static class Utils
    {
        public static void DeleteFile(string filePath)
        {
            GC.Collect();
            GC.WaitForPendingFinalizers();
            File.Delete(filePath);
        }

        public static string GetEnumDisplayName(this Enum enumValue) => enumValue.GetType()
                            .GetMember(enumValue.ToString())
                            .First()
                            .GetCustomAttribute<DisplayAttribute>()
                            .GetName();

        public static ICollection<OptionViewModel> GetEnumsAsOptionData<T>()
        {
            List<OptionViewModel> result = new List<OptionViewModel>();
            var values = Enum.GetValues(typeof(T)).Cast<T>().ToList();
            for (int i = 0; i < values.Count(); i++)
            {
                OptionViewModel item = new OptionViewModel
                {
                    Value = (i + 1).ToString(),
                    Label = values[i].GetType().GetMember(values[i].ToString()).First().GetCustomAttribute<DisplayAttribute>().GetName()
                };
                result.Add(item);
            }
            return result;
        }
        public static string ConvertStringToHex(String input, Encoding encoding)
        {
            Byte[] stringBytes = encoding.GetBytes(input);
            StringBuilder sbBytes = new StringBuilder(stringBytes.Length * 2);
            foreach (byte b in stringBytes)
            {
                sbBytes.AppendFormat("{0:X2}", b);
            }
            return sbBytes.ToString();
        }

        public static string ConvertHexToString(String hexInput, Encoding encoding)
        {
            string result = string.Empty;
            int numberChars = hexInput.Length;
            byte[] bytes = new byte[numberChars / 2];
            try
            {
                for (int i = 0; i < numberChars; i += 2)
                {
                    bytes[i / 2] = Convert.ToByte(hexInput.Substring(i, 2), 16);
                }
                result = encoding.GetString(bytes);
            }
            catch (Exception e)
            {
                result = string.Empty;
            }
            return result;
        }
        
        public static ICollection<LanguageViewModel> GetAllLanguages()
        {
            using (StreamReader r = new StreamReader(Constant.LANGUAGE_JSON))
            {
                var json = r.ReadToEnd();
                var items = JsonConvert.DeserializeObject<List<LanguageViewModel>>(json);
                return items;
            }
        }

        public static SenderViewModel GetSenderInfo()
        {
            using (StreamReader r = new StreamReader(Constant.SENDER_JSON))
            {
                var json = r.ReadToEnd();
                var items = JsonConvert.DeserializeObject<SenderViewModel>(json);
                return items;
            }
        }
    }
}
